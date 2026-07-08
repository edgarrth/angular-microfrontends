import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { ApiResult, AuthSessionService, EventBusService, PAYMENT_PROCESSING_API_CONFIG, PaymentEvent } from 'shared';

interface PaymentHistoryItem {
  id: string;
  status: string;
  amount: number;
  currency: string;
  beneficiaryName: string;
  createdAt: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AccountSummaryDto {
  totalBalance: number;
  availableBalance: number;
  accounts: number;
  cards: number;
}

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);
  private readonly auth = inject(AuthSessionService);
  private readonly eventBus = inject(EventBusService);

  readonly summary$: Observable<AccountSummaryDto> = this.http
    .get<ApiResult<AccountSummaryDto>>(`${this.config.accountsApiUrl}/accounts/summary`)
    .pipe(map((result) => result.data), shareReplay({ bufferSize: 1, refCount: true }));

  readonly recentPayments$: Observable<PaymentHistoryItem[]> = this.http
    .get<ApiResult<PaymentHistoryItem[]>>(`${this.config.paymentsApiUrl}/payments/history?limit=3`)
    .pipe(map((result) => result.data), shareReplay({ bufferSize: 1, refCount: true }));

  readonly notifications$: Observable<NotificationItem[]> = this.http
    .get<ApiResult<NotificationItem[]>>(`${this.config.notificationsApiUrl}/notifications?limit=3`)
    .pipe(map((result) => result.data), shareReplay({ bufferSize: 1, refCount: true }));

  readonly events$ = this.eventBus.events$.pipe(startWith<PaymentEvent>({
    type: 'NOTIFICATION_RECEIVED',
    message: 'Event Bus listo para recibir eventos de los Microfrontends.',
    occurredAt: new Date().toISOString(),
  }));

  login(): void {
    this.http
      .post<ApiResult<{ accessToken: string; user: { id: string; username: string; displayName: string; roles: string[] } }>>(
        `${this.config.authApiUrl}/auth/login`,
        { username: 'edgar', password: 'demo' },
      )
      .subscribe((result) => {
        this.auth.login({
          userId: result.data.user.id,
          username: result.data.user.username,
          displayName: result.data.user.displayName,
          roles: result.data.user.roles,
          accessToken: result.data.accessToken,
        });
      });
  }

  logout(): void {
    this.auth.logout();
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }
}
