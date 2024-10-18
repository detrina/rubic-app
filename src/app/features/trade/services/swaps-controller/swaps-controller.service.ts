import { Injectable } from '@angular/core';
import { combineLatestWith, firstValueFrom, forkJoin, from, Observable, of, Subject } from 'rxjs';
import { SwapsFormService } from '@features/trade/services/swaps-form/swaps-form.service';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { SdkService } from '@core/services/sdk/sdk.service';
import { SwapsStateService } from '@features/trade/services/swaps-state/swaps-state.service';
import { CrossChainService } from '@features/trade/services/cross-chain/cross-chain.service';
import { OnChainService } from '@features/trade/services/on-chain/on-chain.service';
import { CrossChainTrade } from 'rubic-sdk/lib/features/cross-chain/calculation-manager/providers/common/cross-chain-trade';
import { SelectedTrade } from '@features/trade/models/selected-trade';
import { ErrorsService } from '@core/errors/errors.service';
import { AuthService } from '@core/services/auth/auth.service';
import { TradePageService } from '@features/trade/services/trade-page/trade-page.service';

import { RefreshService } from '@features/trade/services/refresh-service/refresh.service';
import {
  ALGB_TOKEN,
  ChangenowCrossChainTrade,
  CROSS_CHAIN_TRADE_TYPE,
  CrossChainIsUnavailableError,
  CrossChainTradeType,
  NotSupportedTokensError,
  OnChainTradeType,
  RubicSdkError,
  UnsupportedReceiverAddressError,
  UserRejectError,
  Web3Pure,
  NoLinkedAccountError,
  SymbiosisEvmCcrTrade,
  BLOCKCHAIN_NAME,
  OnChainTrade,
  LowSlippageError,
  RetroBridgeTrade,
  RetroBridgeEvmTrade,
  RetroBridgeTonTrade
} from 'rubic-sdk';
import { RubicError } from '@core/errors/models/rubic-error';
import { ERROR_TYPE } from '@core/errors/models/error-type';
import CrossChainIsUnavailableWarning from '@core/errors/models/cross-chain/cross-chainIs-unavailable-warning';
import TooLowAmountError from '@core/errors/models/common/too-low-amount-error';
import { RubicSdkErrorParser } from '@core/errors/models/rubic-sdk-error-parser';
import { ExecutionRevertedError } from '@core/errors/models/common/execution-reverted-error';
import CrossChainPairCurrentlyUnavailableError from '@core/errors/models/cross-chain/cross-chain-pair-currently-unavailable-error';
import NotWhitelistedProviderWarning from '@core/errors/models/common/not-whitelisted-provider-warning';
import UnsupportedDeflationTokenWarning from '@core/errors/models/common/unsupported-deflation-token.warning';
import { ModalService } from '@core/modals/services/modal.service';
import { SettingsService } from '@features/trade/services/settings-service/settings.service';
import { onChainBlacklistProviders } from '@features/trade/services/on-chain/constants/on-chain-blacklist';
import DelayedApproveError from '@core/errors/models/common/delayed-approve.error';
import AmountChangeWarning from '@core/errors/models/cross-chain/amount-change-warning';
import { SWAP_PROVIDER_TYPE } from '@features/trade/models/swap-provider-type';
import { TargetNetworkAddressService } from '@features/trade/services/target-network-address-service/target-network-address.service';
import { CrossChainApiService } from '../cross-chain-routing-api/cross-chain-api.service';
import { OnChainApiService } from '../on-chain-api/on-chain-api.service';
import { CrossChainSwapAdditionalParams } from '../preview-swap/models/swap-controller-service-types';
import { compareObjects } from '@app/shared/utils/utils';
import CrossChainSwapUnavailableWarning from '@core/errors/models/cross-chain/cross-chain-swap-unavailable-warning';
import { WrappedSdkTrade } from '@features/trade/models/wrapped-sdk-trade';

@Injectable()
export class SwapsControllerService {
  private readonly _calculateTrade$ = new Subject<{
    isForced?: boolean;
    stop?: boolean;
  }>();

  public readonly calculateTrade$ = this._calculateTrade$.asObservable().pipe(debounceTime(20));

  /**
   * Contains trades types, which were disabled due to critical errors.
   */
  private disabledTradesTypes: {
    crossChain: CrossChainTradeType[];
    onChain: OnChainTradeType[];
  } = {
    crossChain: [],
    onChain: []
  };

  constructor(
    private readonly swapFormService: SwapsFormService,
    private readonly sdkService: SdkService,
    private readonly crossChainService: CrossChainService,
    private readonly onChainService: OnChainService,
    private readonly swapsStateService: SwapsStateService,
    private readonly errorsService: ErrorsService,
    private readonly authService: AuthService,
    private readonly tradePageService: TradePageService,
    private readonly refreshService: RefreshService,
    private readonly modalService: ModalService,
    private readonly settingsService: SettingsService,
    private readonly targetNetworkAddressService: TargetNetworkAddressService,
    private readonly crossChainApiService: CrossChainApiService,
    private readonly onChainApiService: OnChainApiService
  ) {
    this.subscribeOnFormChanges();
    this.subscribeOnCalculation();
    this.subscribeOnRefreshServiceCalls();
    this.subscribeOnAddressChange();
    this.subscribeOnSettings();
    this.subscribeOnReceiverChange();
  }

  /**
   * Subscribes on input form changes and controls recalculation after it.
   */
  private subscribeOnFormChanges(): void {
    this.swapFormService.inputValueDistinct$.subscribe(() => {
      this.startRecalculation(true);
    });
  }

  private startRecalculation(isForced = false): void {
    this._calculateTrade$.next({ isForced });
  }

  private subscribeOnCalculation(): void {
    this.calculateTrade$
      .pipe(
        debounceTime(200),
        map(calculateData => {
          if (calculateData.stop || !this.swapFormService.isFilled) {
            this.refreshService.setStopped();
            // this.tradeStatus = TRADE_STATUS.DISABLED;

            // if (
            //   this.swapTypeService.getSwapProviderType() === SWAP_PROVIDER_TYPE.CROSS_CHAIN_ROUTING
            // ) {
            //   this.refreshService.setStopped();
            //   this.swapFormService.outputControl.patchValue({
            //     toAmount: new BigNumber(NaN)
            //   });
            // }

            return { ...calculateData, stop: true };
          }
          return { ...calculateData, stop: false };
        }),
        tap(calculateData => {
          if (!calculateData.stop) {
            this.refreshService.setRefreshing();
            this.swapsStateService.setCalculationProgress(1, 0);
            if (calculateData.isForced) {
              this.swapsStateService.clearProviders(false);
              this.disabledTradesTypes.crossChain = [];
              this.disabledTradesTypes.onChain = [];
            }
            this.swapsStateService.patchCalculationState();
          }
        }),
        switchMap(calculateData => {
          if (calculateData.stop) {
            return of(null);
          }

          const { fromToken, toToken } = this.swapFormService.inputValue;

          const isAlgebraWrap =
            Object.values(ALGB_TOKEN).includes(fromToken.address.toLowerCase()) &&
            Object.values(ALGB_TOKEN).includes(toToken.address.toLowerCase());

          if (isAlgebraWrap) {
            this.disabledTradesTypes.crossChain = [
              ...Object.values(CROSS_CHAIN_TRADE_TYPE).filter(type => type !== 'layerzero')
            ];
          } else {
            this.disabledTradesTypes.crossChain = [
              ...this.disabledTradesTypes.crossChain,
              'layerzero'
            ];
          }

          if (fromToken.blockchain === toToken.blockchain) {
            return this.onChainService
              .calculateTrades([...this.disabledTradesTypes.onChain, ...onChainBlacklistProviders])
              .pipe(
                catchError(err => {
                  console.debug(err);
                  return of(null);
                })
              );
          } else {
            return this.crossChainService.calculateTrades(this.disabledTradesTypes.crossChain).pipe(
              catchError(err => {
                console.debug(err);
                return of(null);
              })
            );
          }
        }),
        catchError(err => {
          console.debug(err);
          return of(null);
        }),
        concatMap(container => {
          const wrappedTrade = container?.value?.wrappedTrade;

          if (wrappedTrade) {
            const isCalculationEnd = container.value.total === container.value.calculated;
            const needApprove$ = wrappedTrade?.trade?.needApprove().catch(() => false) || of(false);
            const needAuthWallet$ = this.needAuthWallet(wrappedTrade.trade);
            const isNotLinkedAccount$ = this.checkIsNotLinkedAccount(
              wrappedTrade.trade,
              wrappedTrade?.error
            );

            return forkJoin([
              of(wrappedTrade),
              needApprove$,
              of(container.type),
              isNotLinkedAccount$,
              needAuthWallet$
            ])
              .pipe(
                tap(([trade, needApprove, type, isNotLinkedAccount, needAuthWallet]) => {
                  try {
                    if (isNotLinkedAccount) {
                      this.errorsService.catch(new NoLinkedAccountError());
                      trade.trade = null;
                    }
                    this.swapsStateService.updateTrade(trade, type, needApprove, needAuthWallet);
                    this.swapsStateService.pickProvider(isCalculationEnd);
                    this.swapsStateService.setCalculationProgress(
                      container.value.total,
                      container.value.calculated
                    );
                    this.setTradeAmount();
                    if (isCalculationEnd) {
                      this.refreshService.setStopped();
                    }
                  } catch (err) {
                    console.error(err);
                  }
                })
              )
              .pipe(
                catchError(() => {
                  // this.swapsStateService.updateTrade(trade, type, needApprove);
                  this.swapsStateService.pickProvider(isCalculationEnd);
                  return of(null);
                })
              );
          }
          if (!container?.value) {
            this.refreshService.setStopped();
            this.swapsStateService.clearProviders(true);
          } else {
            this.swapsStateService.setCalculationProgress(
              container.value.total,
              container.value.calculated
            );
          }
          return of(null);
        }),
        catchError((_err: unknown) => {
          this.refreshService.setStopped();
          this.swapsStateService.pickProvider(true);
          return of(null);
        })
      )
      .subscribe();
  }

  private subscribeOnRefreshServiceCalls(): void {
    this.refreshService.onRefresh$.subscribe(refreshState => {
      this.startRecalculation(refreshState.isForced);
    });
  }

  private setTradeAmount(): void {
    const trade = this.swapsStateService.tradeState?.trade;
    if (trade) {
      this.swapFormService.outputControl.patchValue({
        toAmount: trade.to.tokenAmount
      });
    }
  }

  public async swap(
    tradeState: SelectedTrade,
    callback?: {
      onHash?: (hash: string) => void;
      onSwap?: (additionalInfo: CrossChainSwapAdditionalParams) => void;
      onError?: () => void;
    }
  ): Promise<void> {
    const trade = tradeState.trade;
    let txHash: string;

    try {
      const allowSlippageAndPI = await this.settingsService.checkSlippageAndPriceImpact(
        trade instanceof CrossChainTrade
          ? SWAP_PROVIDER_TYPE.CROSS_CHAIN_ROUTING
          : SWAP_PROVIDER_TYPE.INSTANT_TRADE,
        trade
      );

      if (!allowSlippageAndPI) {
        callback.onError?.();
        return;
      }
      if (trade instanceof CrossChainTrade) {
        txHash = await this.crossChainService.swapTrade(trade, callback.onHash);
      } else {
        txHash = await this.onChainService.swapTrade(trade, callback.onHash);
      }
    } catch (err) {
      if (err instanceof AmountChangeWarning) {
        const allowSwap = await firstValueFrom(
          this.modalService.openRateChangedModal(
            Web3Pure.fromWei(err.oldAmount, trade.to.decimals),
            Web3Pure.fromWei(err.newAmount, trade.to.decimals),
            trade.to.symbol
          )
        );

        if (allowSwap) {
          try {
            if (trade instanceof CrossChainTrade) {
              txHash = await this.crossChainService.swapTrade(trade, callback.onHash, true);
            } else {
              txHash = await this.onChainService.swapTrade(trade, callback.onHash, true);
            }
          } catch (innerErr) {
            this.catchSwapError(innerErr, tradeState, callback?.onError);
          }
        } else {
          this.catchSwapError(new UserRejectError(), tradeState, callback?.onError);
        }
      } else {
        this.catchSwapError(err, tradeState, callback?.onError);
      }
    }

    if (!txHash) return;

    if (trade instanceof CrossChainTrade) {
      await this.handleCrossChainSwapResponse(trade, txHash, callback.onSwap);
    } else {
      await this.handleOnChainSwapResponse(txHash, callback.onSwap);
    }
  }

  public async approve(
    tradeState: SelectedTrade,
    callback?: {
      onHash?: (hash: string) => void;
      onSwap?: (...args: unknown[]) => void;
      onError?: () => void;
    }
  ): Promise<void> {
    try {
      if (tradeState.trade instanceof CrossChainTrade) {
        await this.crossChainService.approveTrade(tradeState.trade, callback.onHash);
      } else {
        await this.onChainService.approveTrade(tradeState.trade, callback.onHash);
      }
      callback?.onSwap();
    } catch (err) {
      console.error(err);
      callback?.onError();
      let error = err;
      if (err?.message?.includes('Transaction was not mined within 50 blocks')) {
        error = new DelayedApproveError();
      }
      this.errorsService.catch(error);
    }
  }

  public async authWallet(
    tradeState: SelectedTrade,
    callback?: {
      onHash?: (hash: string) => void;
      onSwap?: (...args: unknown[]) => void;
      onError?: () => void;
    }
  ): Promise<void> {
    const trade = tradeState.trade as RetroBridgeTrade;
    try {
      await trade.authWallet();
      callback.onSwap();
    } catch (err) {
      console.error(err);
      callback.onError();
      this.errorsService.catch(err);
    }
  }

  private subscribeOnAddressChange(): void {
    this.authService.currentUser$
      .pipe(
        distinctUntilChanged(),
        switchMap(() => this.swapFormService.isFilled$),
        filter(isFilled => isFilled)
      )
      .subscribe(() => {
        this.startRecalculation(true);
      });
  }

  private parseCalculationError(error?: RubicSdkError): RubicError<ERROR_TYPE> {
    if (error instanceof NotSupportedTokensError) {
      return new RubicError('Currently, Rubic does not support swaps between these tokens.');
    }
    if (error instanceof UnsupportedReceiverAddressError) {
      return new RubicError('This provider doesn’t support the receiver address.');
    }
    if (error instanceof CrossChainIsUnavailableError) {
      return new CrossChainIsUnavailableWarning();
    }
    if (error instanceof LowSlippageError) {
      return new RubicError('Slippage is too low for transaction.');
    }
    if (error instanceof TooLowAmountError) {
      return new RubicError(
        "The swap can't be executed with the entered amount of tokens. Please change it to the greater amount."
      );
    }
    if (error?.message?.includes('No available routes')) {
      return new RubicError('No available routes.');
    }
    if (error?.message?.includes('There are no providers for trade')) {
      return new RubicError('There are no providers for trade.');
    }
    if (error?.message?.includes('Representation of ')) {
      return new RubicError('The swap between this pair of blockchains is currently unavailable.');
    }

    const parsedError = error && RubicSdkErrorParser.parseError(error);
    if (!parsedError || parsedError instanceof ExecutionRevertedError) {
      return new CrossChainPairCurrentlyUnavailableError();
    } else {
      return parsedError;
    }
  }

  private isExecutionCriticalError(error: RubicError<ERROR_TYPE>): boolean {
    return [
      NotWhitelistedProviderWarning,
      UnsupportedDeflationTokenWarning,
      ExecutionRevertedError,
      CrossChainSwapUnavailableWarning
    ].some(CriticalError => error instanceof CriticalError);
  }

  private checkIsNotLinkedAccount(
    trade: CrossChainTrade | OnChainTrade,
    error: RubicSdkError | undefined
  ): Observable<boolean> {
    if (error && error instanceof NoLinkedAccountError) {
      return of(true);
    }
    if (trade instanceof SymbiosisEvmCcrTrade && trade.to.blockchain === BLOCKCHAIN_NAME.SEI) {
      return from(trade.checkBlockchainRequirements());
    }
    return of(false);
  }

  private needAuthWallet(trade: CrossChainTrade | OnChainTrade): Observable<boolean> {
    if (trade instanceof RetroBridgeEvmTrade || trade instanceof RetroBridgeTonTrade) {
      return from(trade.needAuthWallet());
    }
    return of(false);
  }

  private async handleCrossChainSwapResponse(
    trade: CrossChainTrade,
    txHash?: string,
    onSwap?: (params?: CrossChainSwapAdditionalParams) => void
  ): Promise<void> {
    if (txHash) {
      const params: CrossChainSwapAdditionalParams = {};

      if (trade instanceof ChangenowCrossChainTrade) {
        params.changenowId = trade.changenowId as string;
      }
      if ('rangoRequestId' in trade) {
        params.rangoRequestId = trade.rangoRequestId as string;
      }
      if ('squidrouterRequestId' in trade) {
        params.squidrouterId = trade.squidrouterRequestId as string;
      }
      if (trade instanceof RetroBridgeTrade) {
        params.retroBridgeId = trade.retroBridgeId;
      }

      onSwap?.(params);
      await this.crossChainApiService.patchTrade(txHash, true);
    }
  }

  private async handleOnChainSwapResponse(
    txHash?: string,
    onSwap?: (params?: CrossChainSwapAdditionalParams) => void
  ): Promise<void> {
    if (txHash) {
      onSwap?.();
      await this.onChainApiService.patchTrade(txHash, true);
    }
  }

  private catchSwapError(
    err: RubicSdkError,
    tradeState: SelectedTrade,
    onError?: () => void
  ): void {
    console.error(err);
    const parsedError = this.parseCalculationError(err);
    if (this.isExecutionCriticalError(parsedError)) {
      if (tradeState.trade instanceof CrossChainTrade) {
        this.disabledTradesTypes.crossChain.push(tradeState.trade.type);
      } else {
        this.disabledTradesTypes.onChain.push(tradeState.trade.type);
      }
      this.swapsStateService.updateTrade(
        {
          trade: null,
          error: parsedError,
          tradeType: tradeState.tradeType
        } as WrappedSdkTrade,
        tradeState.trade instanceof CrossChainTrade
          ? SWAP_PROVIDER_TYPE.CROSS_CHAIN_ROUTING
          : SWAP_PROVIDER_TYPE.INSTANT_TRADE,
        false,
        false
      );
      this.swapsStateService.pickProvider(true);
    }
    onError?.();
    this.errorsService.catch(parsedError);
  }

  private subscribeOnSettings(): void {
    this.settingsService.crossChainRoutingValueChanges
      .pipe(
        startWith(this.settingsService.crossChainRoutingValue),
        distinctUntilChanged((prev, next) => prev.useMevBotProtection !== next.useMevBotProtection),
        combineLatestWith(
          this.settingsService.instantTradeValueChanges.pipe(
            startWith(this.settingsService.instantTradeValue),
            distinctUntilChanged(
              (prev, next) => prev.useMevBotProtection !== next.useMevBotProtection
            )
          )
        ),
        debounceTime(10),
        pairwise(),
        filter(([prev, next]) => !compareObjects(prev, next))
      )
      .subscribe(() => {
        this.startRecalculation(true);
      });
  }

  private subscribeOnReceiverChange(): void {
    this.targetNetworkAddressService.address$
      .pipe(combineLatestWith(this.targetNetworkAddressService.isAddressValid$), debounceTime(50))
      .subscribe(([address, isValid]) => {
        if (address === '' || (address && isValid)) {
          this.startRecalculation(true);
        }
      });
  }
}
