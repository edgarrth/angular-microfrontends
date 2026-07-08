import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiResult, PAYMENT_PROCESSING_API_CONFIG } from 'shared';

interface PaymentHistoryItem {
  id: string;
  status: string;
  amount: number;
  currency: string;
  beneficiaryName: string;
  createdAt: string;
}

@Component({
  selector: 'payments-home-section',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, RouterLink],
  template: `
    <section class="mfe-home-section payments-section">
      <header>
        <span class="remote-label">Payments MFE</span>
        <h2>Últimos pagos</h2>
        <p>Sección federada expuesta por el Microfrontend de Payments.</p>
      </header>

      <ng-container *ngIf="recentPayments$ | async as payments; else loading">
        <ul *ngIf="payments.length > 0; else emptyState">
          <li *ngFor="let payment of payments">
            <span class="badge">{{ payment.status }}</span>
            <div>
              <strong>{{ payment.beneficiaryName }}</strong>
              <small>
                {{ payment.amount | currency: payment.currency }} · {{ payment.createdAt | date: 'short' }}
              </small>
            </div>
          </li>
        </ul>

        <ng-template #emptyState>
          <p class="loading">No existen pagos registrados todavía.</p>
        </ng-template>

        <a routerLink="/payments">Procesar nuevo pago</a>
      </ng-container>

      <ng-template #loading>
        <p class="loading">Cargando últimos pagos...</p>
      </ng-template>
    </section>
  `,
  styles: [`
    .mfe-home-section {
      background: #ffffff;
      border: 1px solid #fedf89;
      border-radius: 22px;
      box-shadow: 0 14px 36px rgb(16 24 40 / 8%);
      display: grid;
      gap: 1rem;
      min-height: 260px;
      padding: 1.5rem;
    }

    .remote-label {
      color: #b54708;
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

    ul {
      display: grid;
      gap: 0.75rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      align-items: flex-start;
      background: #fffbeb;
      border-radius: 16px;
      display: flex;
      gap: 0.75rem;
      padding: 0.85rem;
    }

    li div {
      display: grid;
      gap: 0.2rem;
    }

    li strong {
      color: #101828;
    }

    .badge {
      background: #fef0c7;
      border-radius: 999px;
      color: #b54708;
      flex: 0 0 auto;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.25rem 0.55rem;
    }

    a {
      align-self: end;
      background: #dc6803;
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
export class PaymentsHomeSectionComponent {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);

  readonly recentPayments$: Observable<PaymentHistoryItem[]> = this.http
    .get<ApiResult<PaymentHistoryItem[]>>(`${this.config.paymentsApiUrl}/payments/history?limit=3`)
    .pipe(
      map((result) => result.data),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
}
