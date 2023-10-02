import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, forkJoin, from, interval, Observable, of } from 'rxjs';
import { first, map, startWith, switchMap, takeWhile, tap } from 'rxjs/operators';
import { SwapsFormService } from '@features/trade/services/swaps-form/swaps-form.service';
import { TokenAmount } from '@shared/models/tokens/token-amount';
import { AssetSelector } from '@shared/models/asset-selector';
import { BLOCKCHAINS } from '@shared/constants/blockchain/ui-blockchains';
import { blockchainColor } from '@shared/constants/blockchain/blockchain-color';
import { SelectedTrade } from '@features/trade/models/selected-trade';
import { SwapsStateService } from '@features/trade/services/swaps-state/swaps-state.service';
import { SwapsControllerService } from '@features/trade/services/swaps-controller/swaps-controller.service';
import { CrossChainTrade } from 'rubic-sdk/lib/features/cross-chain/calculation-manager/providers/common/cross-chain-trade';
import BigNumber from 'bignumber.js';
import {
  BlockchainName,
  CrossChainTradeType,
  TX_STATUS,
  Web3PublicSupportedBlockchain
} from 'rubic-sdk';
import { SdkService } from '@core/services/sdk/sdk.service';
import { TransactionState } from '@features/trade/models/transaction-state';
import { WalletConnectorService } from '@core/services/wallets/wallet-connector-service/wallet-connector.service';

interface TokenFiatAmount {
  tokenAmount: BigNumber;
  fiatAmount: string;
}

interface TradeInfo {
  fromAsset: AssetSelector;
  fromValue: TokenFiatAmount;
  toAsset: AssetSelector;
  toValue: TokenFiatAmount;
}

@Injectable()
export class PreviewSwapService {
  private readonly _formState$ = new BehaviorSubject<'preview' | 'process' | 'complete'>('preview');

  public readonly formState$ = this._formState$.asObservable();

  private readonly _transactionState$ = new BehaviorSubject<TransactionState>({
    step: 'idle',
    data: {}
  });

  private get transactionState(): TransactionState {
    return this._transactionState$.getValue();
  }

  public readonly transactionState$ = this._transactionState$.asObservable();

  public readonly tradeState$: Observable<SelectedTrade> = this.swapsStateService.tradeState$.pipe(
    first()
  );

  public tradeInfo$: Observable<TradeInfo> = forkJoin([
    this.swapForm.fromToken$.pipe(first()),
    this.swapForm.fromAmount$.pipe(first()),
    this.swapForm.toToken$.pipe(first()),
    this.swapForm.toAmount$.pipe(first())
  ]).pipe(
    map(([fromToken, fromAmount, toToken, toAmount]) => {
      const fromAsset = this.getTokenAsset(fromToken);
      const fromValue = {
        tokenAmount: fromAmount,
        fiatAmount:
          fromAmount.gt(0) && fromToken.price
            ? fromAmount.multipliedBy(fromToken.price || 0).toFixed(2)
            : null
      };

      const toAsset = this.getTokenAsset(toToken);
      const toValue = {
        tokenAmount: toAmount,
        fiatAmount:
          toAmount.gt(0) && toToken.price
            ? toAmount.multipliedBy(toToken.price || 0).toFixed(2)
            : null
      };

      return { fromAsset, fromValue, toAsset, toValue };
    })
  );

  constructor(
    private readonly swapsStateService: SwapsStateService,
    private readonly swapForm: SwapsFormService,
    private readonly swapsControllerService: SwapsControllerService,
    private readonly sdkService: SdkService,
    private readonly walletConnectorService: WalletConnectorService
  ) {
    this.handleTransactionState();
    this.subscribeOnNetworkChange();
  }

  private getTokenAsset(token: TokenAmount): AssetSelector {
    const blockchain = BLOCKCHAINS[token.blockchain];
    const color = blockchainColor[token.blockchain];

    return {
      secondImage: blockchain.img,
      secondLabel: blockchain.name,
      mainImage: token.image,
      mainLabel: token.symbol,
      secondColor: color
    };
  }

  public setNextTxState(state: TransactionState): void {
    this._transactionState$.next(state);
  }

  public async requestTxSign(): Promise<void> {
    this._formState$.next('process');
    const tradeState = await firstValueFrom(this.tradeState$);

    if (tradeState.needApprove) {
      this.startApprove();
    } else {
      this.startSwap();
    }
  }

  public startSwap(): void {
    this._transactionState$.next({ step: 'swapRequest', data: this.transactionState.data });
  }

  public startApprove(): void {
    this._transactionState$.next({ step: 'approvePending', data: this.transactionState.data });
  }

  private handleTransactionState(): void {
    this.transactionState$
      .pipe(
        switchMap(state => forkJoin([this.tradeState$, of(state)])),
        switchMap(([tradeState, txState]) => {
          switch (txState.step) {
            case 'approvePending': {
              return this.swapsControllerService.approve(tradeState, {
                onSwap: () => {
                  this._transactionState$.next({
                    step: 'swapRequest',
                    data: this.transactionState.data
                  });
                },
                onError: () => {
                  this._transactionState$.next({
                    step: 'approveReady',
                    data: this.transactionState.data
                  });
                }
              });
            }
            case 'swapRequest': {
              let txHash: string;
              return this.swapsControllerService.swap(tradeState, {
                onHash: (hash: string) => {
                  txHash = hash;
                  this._transactionState$.next({
                    step: 'sourcePending',
                    data: this.transactionState.data
                  });
                },
                onSwap: () => {
                  if (tradeState.trade instanceof CrossChainTrade) {
                    this._transactionState$.next({
                      step: 'destinationPending',
                      data: this.transactionState.data
                    });
                    this.initDstTxStatusPolling(txHash, Date.now(), tradeState.trade.to.blockchain);
                  } else {
                    this._transactionState$.next({
                      step: 'success',
                      data: { hash: txHash, toBlockchain: tradeState.trade.to.blockchain }
                    });
                  }
                },
                onError: () => {
                  this._transactionState$.next({
                    step: 'swapReady',
                    data: this.transactionState.data
                  });
                }
              });
            }
            default: {
              return of(null);
            }
          }
        })
      )
      .subscribe();
  }

  public initDstTxStatusPolling(
    srcHash: string,
    timestamp: number,
    toBlockchain: BlockchainName
  ): void {
    interval(30_000)
      .pipe(
        startWith(-1),
        switchMap(() => this.tradeState$),
        switchMap(tradeState => {
          const amount =
            'price' in tradeState.trade.toTokenAmountMin
              ? tradeState.trade.toTokenAmountMin.tokenAmount
              : tradeState.trade.toTokenAmountMin;
          return from(
            this.sdkService.crossChainStatusManager.getCrossChainStatus(
              {
                fromBlockchain: tradeState.trade.from.blockchain as Web3PublicSupportedBlockchain,
                toBlockchain: tradeState.trade.to.blockchain,
                srcTxHash: srcHash,
                txTimestamp: timestamp,
                amountOutMin: amount.toFixed()
              },
              tradeState.tradeType as CrossChainTradeType
            )
          );
        }),
        tap(crossChainStatus => {
          if (crossChainStatus.dstTxStatus === TX_STATUS.SUCCESS) {
            this._transactionState$.next({
              step: 'success',
              data: {
                hash: crossChainStatus.dstTxHash,
                toBlockchain
              }
            });
            this._formState$.next('complete');
          } else if (crossChainStatus.dstTxStatus === TX_STATUS.FAIL) {
            this._transactionState$.next({ step: 'error', data: this.transactionState.data });
            this._formState$.next('complete');
          }
        }),
        takeWhile(crossChainStatus => crossChainStatus.dstTxStatus === TX_STATUS.PENDING)
      )
      .subscribe();
  }

  private subscribeOnNetworkChange(): void {
    this.walletConnectorService.networkChange$
      .pipe(
        startWith(this.walletConnectorService.network),
        switchMap(network => forkJoin(of(network), this.tradeState$))
      )
      .subscribe(([network, trade]) => {
        const tokenBlockchain = trade.trade.from.blockchain;
        if (network !== tokenBlockchain) {
          this._transactionState$.next({
            ...this._transactionState$.value,
            data: { wrongNetwork: true }
          });
        } else {
          this._transactionState$.next({
            ...this._transactionState$.value,
            data: { ...this.transactionState.data, wrongNetwork: false }
          });
        }
      });
  }
}
