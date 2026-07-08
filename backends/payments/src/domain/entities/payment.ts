export type PaymentStatus = 'INITIATED' | 'CONFIRMED' | 'FAILED';

export interface Payment {
  id: string;
  sourceAccountId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  confirmedAt?: string;
  authorizationCode?: string;
}
