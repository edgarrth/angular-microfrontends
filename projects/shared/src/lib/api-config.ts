import { InjectionToken } from '@angular/core';

export interface PaymentProcessingApiConfig {
  authApiUrl: string;
  accountsApiUrl: string;
  paymentsApiUrl: string;
  notificationsApiUrl: string;
}

export const PAYMENT_PROCESSING_API_CONFIG = new InjectionToken<PaymentProcessingApiConfig>(
  'PAYMENT_PROCESSING_API_CONFIG',
  {
    providedIn: 'root',
    factory: () => ({
      authApiUrl: 'http://localhost:3000',
      accountsApiUrl: 'http://localhost:3001',
      paymentsApiUrl: 'http://localhost:3002',
      notificationsApiUrl: 'http://localhost:3003',
    }),
  },
);
