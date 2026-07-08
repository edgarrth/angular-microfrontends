import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiResult, EventBusService, PAYMENT_PROCESSING_API_CONFIG } from 'shared';

interface Payment { id: string; status: string; amount: number; currency: string; beneficiaryName: string; createdAt: string; }
interface PaymentInitiated { paymentId: string; status: string; authorizationCode: string; }

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

  amount = 125.5;
  beneficiaryId = 'ben-001';
  sourceAccountId = 'acc-001';
  pendingPaymentId: string | null = null;
  authorizationCode = '';

  readonly history$: Observable<Payment[]> = this.http
    .get<ApiResult<Payment[]>>(`${this.config.paymentsApiUrl}/payments/history`)
    .pipe(map((result) => result.data), shareReplay({ bufferSize: 1, refCount: true }));

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
        this.pendingPaymentId = result.data.paymentId;
        this.authorizationCode = result.data.authorizationCode;
        this.eventBus.publish({
          type: 'PAYMENT_INITIATED',
          paymentId: result.data.paymentId,
          amount: Number(this.amount),
          currency: 'USD',
          message: `Pago iniciado. Código mock: ${result.data.authorizationCode}`,
          occurredAt: new Date().toISOString(),
        });
      });
  }

  confirmPayment(): void {
    if (!this.pendingPaymentId) {
      return;
    }

    this.http
      .post<ApiResult<Payment>>(`${this.config.paymentsApiUrl}/payments/${this.pendingPaymentId}/confirm`, {
        authorizationCode: this.authorizationCode,
      })
      .subscribe((result) => {
        this.eventBus.publish({
          type: 'PAYMENT_CONFIRMED',
          paymentId: result.data.id,
          amount: result.data.amount,
          currency: result.data.currency,
          message: `Pago confirmado para ${result.data.beneficiaryName}`,
          occurredAt: new Date().toISOString(),
        });
      });
  }
}
