import { Injectable } from '@angular/core';
import { AvailableTokenAmount } from '@shared/models/tokens/available-token-amount';
import { BehaviorSubject, Subject } from 'rxjs';
import { BlockchainName } from 'rubic-sdk';
import { TokensService } from '@core/services/tokens/tokens.service';
import { FormType } from '@features/swaps/shared/models/form/form-type';
import { FormGroup } from '@ngneat/reactive-forms';
import { ISwapFormInput } from '@shared/models/swaps/swap-form';
import { TokensSelectComponentInput } from '@features/swaps/shared/components/tokens-select/models/tokens-select-polymorpheus-data';
import { TokensListType } from '@features/swaps/shared/components/tokens-select/models/tokens-list-type';

@Injectable()
export class TokensSelectorService {
  /**
   * Form containing selected tokens and blockchains.
   */
  public _form: FormGroup<ISwapFormInput>;

  public get form(): FormGroup<ISwapFormInput> {
    return this._form;
  }

  public _formType: FormType;

  public get formType(): FormType {
    return this._formType;
  }

  private readonly _blockchain$ = new BehaviorSubject<BlockchainName>(undefined);

  public readonly blockchain$ = this._blockchain$.asObservable();

  public get blockchain(): BlockchainName {
    return this._blockchain$.value;
  }

  public set blockchain(value: BlockchainName) {
    this._blockchain$.next(value);
  }

  /**
   * Defines whether default or favorite tokens are shown.
   */
  private readonly _listType$ = new BehaviorSubject<TokensListType>('default');

  public readonly listType$ = this._listType$.asObservable();

  public get listType(): TokensListType {
    return this._listType$.value;
  }

  public set listType(value: TokensListType) {
    this._listType$.next(value);
  }

  private readonly _tokenSelected$ = new Subject<AvailableTokenAmount>();

  public readonly tokenSelected$ = this._tokenSelected$.asObservable();

  constructor(private readonly tokensService: TokensService) {
    this.subscribeOnBlockchainChange();
  }

  public initParameters(context: Omit<TokensSelectComponentInput, 'idPrefix'>): void {
    this._form = context.form;
    this._formType = context.formType;

    const blockchainType = this.formType === 'from' ? 'fromBlockchain' : 'toBlockchain';
    this.blockchain = this.form.value[blockchainType];
  }

  private subscribeOnBlockchainChange(): void {
    this.blockchain$.subscribe(blockchain => {
      if (!blockchain) {
        return;
      }

      const tokenType = this.formType === 'from' ? 'fromToken' : 'toToken';
      if (!this.form.value[tokenType]) {
        const blockchainType = this.formType === 'from' ? 'fromBlockchain' : 'toBlockchain';
        if (this.form.value[blockchainType] !== blockchain) {
          this.form.patchValue({
            [blockchainType]: this.blockchain
          });
        }
      }

      this.checkAndRefetchTokenList();
    });
  }

  private checkAndRefetchTokenList(): void {
    if (this.tokensService.needRefetchTokens) {
      this.tokensService.tokensRequestParameters = undefined;
    }
  }

  public switchListType(): void {
    if (this.listType === 'default') {
      this.listType = 'favorite';
    } else {
      this.listType = 'default';
    }
  }

  public onTokenSelect(token: AvailableTokenAmount): void {
    this._tokenSelected$.next(token);
  }
}
