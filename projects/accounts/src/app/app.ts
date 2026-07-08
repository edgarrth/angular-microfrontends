import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import {
  ApiResult,
  AuthApiService,
  AuthSessionService,
  LoginPanelComponent,
  PAYMENT_PROCESSING_API_CONFIG,
} from 'shared';

interface Account {
  id: string;
  alias: string;
  type: string;
  currency: string;
  availableBalance: number;
  status: string;
}

interface Card {
  id: string;
  accountId: string;
  brand: string;
  maskedNumber: string;
  status: string;
}

interface Beneficiary {
  id: string;
  alias: string;
  bankName: string;
  accountNumber: string;
  currency: string;
}

@Component({
  selector: 'accounts-root',
  imports: [AsyncPipe, CurrencyPipe, FormsModule, LoginPanelComponent, NgFor, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);
  private readonly auth = inject(AuthSessionService);
  private readonly authApi = inject(AuthApiService);

  private readonly refreshBeneficiaries$ = new Subject<void>();

  readonly session = this.auth.session;

  logout(): void {
    this.authApi.logout().subscribe();
  }

  beneficiaryAlias = 'Proveedor demo';
  beneficiaryAccount = '003-99118822';

  readonly accounts$: Observable<Account[]> = this.http
    .get<ApiResult<Account[]>>(`${this.config.accountsApiUrl}/accounts`)
    .pipe(
      map((result) => result.data),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  readonly cards$: Observable<Card[]> = this.http
    .get<ApiResult<Card[]>>(`${this.config.accountsApiUrl}/accounts/acc-001/cards`)
    .pipe(
      map((result) => result.data),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  readonly beneficiaries$: Observable<Beneficiary[]> = this.refreshBeneficiaries$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.http.get<ApiResult<Beneficiary[]>>(`${this.config.accountsApiUrl}/beneficiaries`),
    ),
    map((result) => result.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  registerBeneficiary(): void {
    this.http
      .post<ApiResult<Beneficiary>>(`${this.config.accountsApiUrl}/beneficiaries`, {
        alias: this.beneficiaryAlias,
        bankName: 'Mock Bank',
        accountNumber: this.beneficiaryAccount,
        currency: 'USD',
      })
      .subscribe((result) => {
        alert(`Beneficiario registrado: ${result.data.alias}`);

        this.beneficiaryAlias = '';
        this.beneficiaryAccount = '';
        this.refreshBeneficiaries$.next();
      });
  }
}
