import { Injectable } from '@angular/core';
import {
  CrossChainTrade,
  CrossChainTradeType,
  EvmCrossChainTrade,
  EvmOnChainTrade,
  OnChainTrade,
  Token,
  TonOnChainTrade,
  Web3Pure,
  nativeTokensList
} from 'rubic-sdk';
import { compareTokens } from '@app/shared/utils/utils';
import { TokensStoreService } from '@app/core/services/tokens/tokens-store.service';
import { TRADES_PROVIDERS } from '../../constants/trades-providers';
import { AppFeeInfo, AppGasData, ProviderInfo } from '../../models/provider-info';
import { TradeProvider } from '../../models/trade-provider';
import { PlatformConfigurationService } from '@app/core/services/backend/platform-configuration/platform-configuration.service';
import BigNumber from 'bignumber.js';

@Injectable()
export class TradeInfoManager {
  constructor(
    private readonly tokensStoreService: TokensStoreService,
    private readonly platformConfigurationService: PlatformConfigurationService
  ) {}

  public getFeeInfo(trade: CrossChainTrade | OnChainTrade): AppFeeInfo {
    const nativeToken = this.tokensStoreService.getNativeToken(trade.from.blockchain);
    return {
      fee: trade.feeInfo,
      nativeToken: nativeToken
    };
  }

  public getProviderInfo(tradeType: TradeProvider): ProviderInfo {
    const provider = TRADES_PROVIDERS[tradeType];
    const providerAverageTime = this.platformConfigurationService.providersAverageTime;
    const currentProviderTime = providerAverageTime?.[tradeType as CrossChainTradeType];
    return {
      ...provider,
      averageTime: currentProviderTime ? currentProviderTime : provider.averageTime
    };
  }

  public getGasData(trade: CrossChainTrade | OnChainTrade): AppGasData | null {
    if (!('gasData' in trade) && !('gasFeeInfo' in trade)) return null;

    const blockchain = trade.from.blockchain;
    const nativeToken = nativeTokensList[blockchain];
    const nativeTokenPrice = this.tokensStoreService.tokens.find(token =>
      compareTokens(token, { blockchain, address: nativeToken.address })
    ).price;

    let gasFeeNonWei = null;
    if (trade instanceof EvmCrossChainTrade) {
      gasFeeNonWei = this.getCcrGasFee(trade, nativeToken);
    } else if (trade instanceof EvmOnChainTrade || trade instanceof TonOnChainTrade) {
      gasFeeNonWei = this.getOnChainGasFee(trade, nativeToken);
    }

    if (!gasFeeNonWei || gasFeeNonWei.lte(0)) return null;

    return {
      amount: gasFeeNonWei,
      amountInUsd: gasFeeNonWei.multipliedBy(nativeTokenPrice),
      symbol: nativeToken.symbol
    };
  }

  /**
   * In trade.gasData:
   * totalGas - in wei
   * gasLimit - in wei
   * gasPrice - in wei
   * maxFeePerGas - in wei
   * @returns gasFee non wei
   */
  private getCcrGasFee(trade: EvmCrossChainTrade, nativeToken: Token): BigNumber | null {
    const gasData = trade.gasData;
    if (!gasData) return null;

    let gasFeeWei: BigNumber | null = null;
    if ('totalGas' in gasData) {
      gasFeeWei = gasData.totalGas;
    } else if ('gasPrice' in gasData && gasData.gasPrice.gt(0)) {
      gasFeeWei = gasData.gasLimit?.multipliedBy(gasData.gasPrice);
    } else if ('maxFeePerGas' in gasData && gasData.maxFeePerGas.gt(0)) {
      gasFeeWei = gasData.gasLimit?.multipliedBy(gasData.maxFeePerGas || 0);
    }

    if (!gasFeeWei) return null;

    console.log(`%c${trade.type}`, 'color: red; font-size: 20px;', {
      gasPriceWei: gasData.gasPrice?.toFixed(),
      gasLimitWei: gasData.gasLimit?.toFixed(),
      maxFeePerGas: gasData.maxFeePerGas?.toFixed(),
      totalGas: gasData.totalGas?.toFixed()
    });

    return Web3Pure.fromWei(gasFeeWei, nativeToken.decimals);
  }

  /**
   * In trade.gasFeeInfo:
   * totalGas - in wei
   * gasLimit - in wei
   * gasPrice - in wei
   * maxFeePerGas - in wei
   * @returns gasFee non wei
   */
  private getOnChainGasFee(
    trade: EvmOnChainTrade | TonOnChainTrade,
    nativeToken: Token
  ): BigNumber | null {
    const gasData = trade.gasFeeInfo;
    if (!gasData) return null;

    if (gasData.totalGas) return Web3Pure.fromWei(gasData.totalGas, nativeToken.decimals);

    if (!gasData.gasLimit) return null;

    let gasFeeWei = null;
    if ('gasPrice' in gasData && gasData.gasPrice.gt(0)) {
      gasFeeWei = gasData.gasLimit.multipliedBy(gasData.gasPrice);
    } else if ('maxFeePerGas' in gasData && gasData.maxFeePerGas.gt(0)) {
      gasFeeWei = gasData.gasLimit.multipliedBy(gasData.maxFeePerGas);
    }

    console.log(`%c${trade.type}`, 'color: yellow; font-size: 20px;', {
      gasPriceWei: gasData.gasPrice?.toFixed(),
      gasLimitWei: gasData.gasLimit?.toFixed(),
      maxFeePerGas: gasData.maxFeePerGas?.toFixed(),
      totalGas: gasData.totalGas?.toFixed()
    });

    return Web3Pure.fromWei(gasFeeWei, nativeToken.decimals);
  }
}
