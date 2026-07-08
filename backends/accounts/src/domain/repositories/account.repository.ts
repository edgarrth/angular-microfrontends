import { Account, Beneficiary, Card } from '../entities/account';

export interface AccountRepository {
  findAccounts(): Account[];
  findCards(accountId: string): Card[];
  findBeneficiaries(): Beneficiary[];
  saveBeneficiary(input: Omit<Beneficiary, 'id' | 'status'>): Beneficiary;
}
