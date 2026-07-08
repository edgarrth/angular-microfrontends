import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import {
  ApiResult,
  EventBusService,
  PAYMENT_PROCESSING_API_CONFIG,
  PaymentEvent,
} from 'shared';

interface Payment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  beneficiaryName: string;
  createdAt: string;
}

interface PaymentInitiated {
  paymentId: string;
  status: string;
  authorizationCode: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface PaymentNotificationRequest {
  paymentId: string;
  status: 'INITIATED' | 'CONFIRMED' | 'FAILED';
  message: string;
  amount?: number;
  currency?: string;
}

@Component({
  selector: 'payments-root',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, FormsModule, NgFor, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);
  private readonly eventBus = inject(EventBusService);

  private readonly refreshHistory$ = new Subject<void>();

  amount = 125.5;
  beneficiaryId = 'ben-001';
  sourceAccountId = 'acc-001';
  pendingPaymentId: string | null = null;
  authorizationCode = '';

  readonly history$: Observable<Payment[]> = this.refreshHistory$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.http.get<ApiResult<Payment[]>>(`${this.config.paymentsApiUrl}/payments/history`),
    ),
    map((result) => result.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  initiatePayment(): void {
    this.http
      .post<ApiResult<PaymentInitiated>>(`${this.config.paymentsApiUrl}/payments/initiate`, {
        sourceAccountId: this.sourceAccountId,
        beneficiaryId: this.beneficiaryId,
        amount: Number(this.amount),
        currency: 'USD',
        description: 'Pago demo desde Microfrontend',
      })
      .subscribe((result) => {
        const paymentEvent: PaymentEvent = {
          type: 'PAYMENT_INITIATED',
          paymentId: result.data.paymentId,
          amount: Number(this.amount),
          currency: 'USD',
          message: `Pago iniciado. Código mock: ${result.data.authorizationCode}`,
          occurredAt: new Date().toISOString(),
        };

        this.pendingPaymentId = result.data.paymentId;
        this.authorizationCode = result.data.authorizationCode;

        this.eventBus.publish(paymentEvent);

        this.registerPaymentNotification({
          paymentId: result.data.paymentId,
          status: 'INITIATED',
          message: paymentEvent.message,
          amount: Number(this.amount),
          currency: 'USD',
        });

        this.refreshHistory$.next();
      });
  }

  confirmPayment(): void {
    if (!this.pendingPaymentId) {
      return;
    }

    this.http
      .post<ApiResult<Payment>>(
        `${this.config.paymentsApiUrl}/payments/${this.pendingPaymentId}/confirm`,
        {
          authorizationCode: this.authorizationCode,
        },
      )
      .subscribe((result) => {
        const paymentEvent: PaymentEvent = {
          type: 'PAYMENT_CONFIRMED',
          paymentId: result.data.id,
          amount: result.data.amount,
          currency: result.data.currency,
          message: `Pago confirmado para ${result.data.beneficiaryName}`,
          occurredAt: new Date().toISOString(),
        };

        this.eventBus.publish(paymentEvent);

        this.registerPaymentNotification({
          paymentId: result.data.id,
          status: 'CONFIRMED',
          message: paymentEvent.message,
          amount: result.data.amount,
          currency: result.data.currency,
        });

        this.pendingPaymentId = null;
        this.authorizationCode = '';

        this.refreshHistory$.next();
      });
  }

  private registerPaymentNotification(command: PaymentNotificationRequest): void {
    this.http
      .post<ApiResult<NotificationItem>>(
        `${this.config.notificationsApiUrl}/notifications/payment-events`,
        command,
      )
      .pipe(
        catchError((error) => {
          console.error('No se pudo registrar la notificación mock', error);
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.eventBus.publish({
          type: 'NOTIFICATION_RECEIVED',
          paymentId: command.paymentId,
          amount: command.amount,
          currency: command.currency,
          message: `Notificación registrada: ${result.data.title}`,
          occurredAt: result.data.createdAt,
        });
      });
  }
}
