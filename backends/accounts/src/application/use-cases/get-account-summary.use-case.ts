import { AccountRepository } from '../../domain/repositories/account.repository';

export class GetAccountSummaryUseCase {
  constructor(private readonly accounts: AccountRepository) {}

  execute() {
    const accountList = this.accounts.findAccounts();
    const cards = accountList.flatMap((account) => this.accounts.findCards(account.id));

    return {
      totalBalance: accountList.reduce((total, account) => total + account.ledgerBalance, 0),
      availableBalance: accountList.reduce((total, account) => total + account.availableBalance, 0),
      accounts: accountList.length,
      cards: cards.length,
    };
  }
}
