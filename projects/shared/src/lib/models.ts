export interface UserSession {
  userId: string;
  username: string;
  displayName: string;
  roles: string[];
  accessToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    roles: string[];
  };
}

export interface AccountSummary {
  totalBalance: number;
  availableBalance: number;
  accounts: number;
  cards: number;
}

export interface PaymentEvent {
  type: 'PAYMENT_INITIATED' | 'PAYMENT_CONFIRMED' | 'PAYMENT_FAILED' | 'NOTIFICATION_RECEIVED';
  paymentId?: string;
  amount?: number;
  currency?: string;
  message: string;
  occurredAt: string;
}

export interface ApiResult<T> {
  data: T;
  correlationId: string;
  generatedAt: string;
}
