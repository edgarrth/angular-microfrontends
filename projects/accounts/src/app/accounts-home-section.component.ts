import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiResult, PAYMENT_PROCESSING_API_CONFIG } from 'shared';

interface AccountSummaryDto {
  totalBalance: number;
  availableBalance: number;
  accounts: number;
  cards: number;
}

@Component({
  selector: 'accounts-home-section',
  imports: [AsyncPipe, CurrencyPipe, NgIf, RouterLink],
  template: `
    <section class="mfe-home-section accounts-section">
      <header>
        <span class="remote-label">Accounts MFE</span>
        <h2>Cuentas y tarjetas</h2>
        <p>Resumen federado expuesto por el Microfrontend de Accounts.</p>
      </header>

      <ng-container *ngIf="summary$ | async as summary; else loading">
        <div class="metric">
          <strong>{{ summary.availableBalance | currency: 'USD' }}</strong>
          <small>Saldo disponible consolidado</small>
        </div>

        <div class="mini-grid">
          <div>
            <strong>{{ summary.accounts }}</strong>
            <small>Cuentas</small>
          </div>
          <div>
            <strong>{{ summary.cards }}</strong>
            <small>Tarjetas</small>
          </div>
        </div>

        <a routerLink="/accounts">Ver detalle de cuentas</a>
      </ng-container>

      <ng-template #loading>
        <p class="loading">Cargando resumen de Accounts...</p>
      </ng-template>
    </section>
  `,
  styles: [`
    .mfe-home-section {
      background: #ffffff;
      border: 1px solid #d1e9ff;
      border-radius: 22px;
      box-shadow: 0 14px 36px rgb(16 24 40 / 8%);
      display: grid;
      gap: 1rem;
      min-height: 260px;
      padding: 1.5rem;
    }

    .remote-label {
      color: #175cd3;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    h2 {
      color: #101828;
      font-size: 1.45rem;
      margin: 0.35rem 0;
    }

    p,
    small {
      color: #667085;
    }

    p {
      margin: 0;
    }

    .metric {
      display: grid;
      gap: 0.25rem;
    }

    .metric strong {
      color: #101828;
      font-size: 2rem;
    }

    .mini-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mini-grid div {
      background: #eff8ff;
      border-radius: 16px;
      display: grid;
      gap: 0.15rem;
      padding: 0.9rem;
    }

    .mini-grid strong {
      color: #175cd3;
      font-size: 1.35rem;
    }

    a {
      align-self: end;
      background: #175cd3;
      border-radius: 999px;
      color: #ffffff;
      font-weight: 800;
      justify-self: start;
      padding: 0.7rem 1rem;
      text-decoration: none;
    }

    .loading {
      background: #f9fafb;
      border-radius: 14px;
      padding: 1rem;
    }
  `],
})
export class AccountsHomeSectionComponent {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);

  readonly summary$: Observable<AccountSummaryDto> = this.http
    .get<ApiResult<AccountSummaryDto>>(`${this.config.accountsApiUrl}/accounts/summary`)
    .pipe(
      map((result) => result.data),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
}
