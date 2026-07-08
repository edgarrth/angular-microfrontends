export interface Account {
  id: string;
  alias: string;
  type: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  status: string;
}

export interface Card {
  id: string;
  accountId: string;
  brand: string;
  maskedNumber: string;
  status: string;
}

export interface Beneficiary {
  id: string;
  alias: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  status: string;
}
