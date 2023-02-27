import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangenowPostTradeService } from '@features/swaps/core/services/changenow-post-trade-service/changenow-post-trade.service';
import { ChangenowPostTrade } from '@features/swaps/core/services/changenow-post-trade-service/models/changenow-post-trade';
import { BlockchainName, ChangenowApiStatus } from 'rubic-sdk';
import { blockchainLabel } from '@shared/constants/blockchain/blockchain-label';
import { DEFAULT_TOKEN_IMAGE } from '@app/shared/constants/tokens/default-token-image';
import { TokensService } from '@core/services/tokens/tokens.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-changenow-post-form',
  templateUrl: './changenow-post-form.component.html',
  styleUrls: ['./changenow-post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangenowPostFormComponent {
  public readonly DEFAULT_TOKEN_IMAGE = DEFAULT_TOKEN_IMAGE;

  public readonly trade: ChangenowPostTrade;

  public readonly status$: Observable<ChangenowApiStatus>;

  constructor(
    private readonly router: Router,
    private readonly changenowPostTradeService: ChangenowPostTradeService,
    private readonly tokensService: TokensService
  ) {
    this.trade = this.changenowPostTradeService.trade;

    if (!this.trade) {
      this.router.navigate(['/'], { queryParamsHandling: 'merge' });
    } else {
      this.changenowPostTradeService.setupUpdate();
      this.status$ = this.changenowPostTradeService.status$;
    }
  }

  public getBlockchainLabel(blockchain: BlockchainName): string {
    return blockchainLabel[blockchain];
  }

  public onImageError($event: Event): void {
    this.tokensService.onTokenImageError($event);
  }

  public async navigateToSwaps(): Promise<void> {
    await this.router.navigate(['/'], { queryParamsHandling: 'merge' });
  }
}
