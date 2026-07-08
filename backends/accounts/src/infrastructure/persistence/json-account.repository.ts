import { randomUUID } from 'node:crypto';
import { Account, Beneficiary, Card } from '../../domain/entities/account';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { JsonDatasetReader } from './json-dataset-reader';

export class JsonAccountRepository implements AccountRepository {
  private readonly accounts: Account[];
  private readonly cards: Card[];
  private readonly beneficiaries: Beneficiary[];

  constructor(reader = new JsonDatasetReader()) {
    this.accounts = reader.read<Account>('accounts.json');
    this.cards = reader.read<Card>('cards.json');
    this.beneficiaries = reader.read<Beneficiary>('beneficiaries.json');
  }

  findAccounts(): Account[] {
    return this.accounts;
  }

  findCards(accountId: string): Card[] {
    return this.cards.filter((card) => card.accountId === accountId);
  }

  findBeneficiaries(): Beneficiary[] {
    return this.beneficiaries;
  }

  saveBeneficiary(input: Omit<Beneficiary, 'id' | 'status'>): Beneficiary {
    const beneficiary = { id: `ben-${randomUUID().slice(0, 8)}`, status: 'ACTIVE', ...input };
    this.beneficiaries.push(beneficiary);
    return beneficiary;
  }
}
