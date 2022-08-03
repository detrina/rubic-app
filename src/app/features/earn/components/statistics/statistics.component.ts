import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { StatisticsService } from '@features/earn/services/statistics.service';
import { WalletConnectorService } from '@app/core/services/blockchain/wallets/wallet-connector-service/wallet-connector.service';
import { skip } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService]
})
export class StatisticsComponent implements OnInit {
  public readonly lockedRBC$ = this.statisticsService.lockedRBC$;

  public readonly lockedRBCInDollars$ = this.statisticsService.lockedRBCInDollars$;

  public readonly circRBCLocked$ = this.statisticsService.circRBCLocked$;

  public readonly rewardPerSecond$ = this.statisticsService.rewardPerSecond$;

  public readonly apr$ = this.statisticsService.apr$;

  public loading = false;

  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly walletConnectorService: WalletConnectorService
  ) {}

  ngOnInit(): void {
    this.getStatisticsData();

    this.walletConnectorService.addressChange$.pipe(skip(1)).subscribe(() => {
      console.log('regresh');
      this.refreshStatistics();
    });
  }

  public refreshStatistics(): void {
    this.loading = true;
    this.statisticsService.updateStatistics();
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  private getStatisticsData(): void {
    this.statisticsService.getLockedRBC();
  }
}
