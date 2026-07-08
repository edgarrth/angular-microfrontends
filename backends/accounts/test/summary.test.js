const test = require('node:test');
const assert = require('node:assert/strict');
const { GetAccountSummaryUseCase } = require('../dist/application/use-cases/get-account-summary.use-case.js');

test('GetAccountSummaryUseCase aggregates balances and cards', () => {
  const repository = {
    findAccounts: () => [
      { id: 'acc-001', ledgerBalance: 100, availableBalance: 80 },
      { id: 'acc-002', ledgerBalance: 50, availableBalance: 50 },
    ],
    findCards: (id) => (id === 'acc-001' ? [{ id: 'card-001' }] : []),
  };
  const summary = new GetAccountSummaryUseCase(repository).execute();
  assert.equal(summary.totalBalance, 150);
  assert.equal(summary.availableBalance, 130);
  assert.equal(summary.cards, 1);
});
