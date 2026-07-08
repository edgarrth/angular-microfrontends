const test = require('node:test');
const assert = require('node:assert/strict');
const { InitiatePaymentUseCase } = require('../dist/application/use-cases/initiate-payment.use-case.js');
const { ConfirmPaymentUseCase } = require('../dist/application/use-cases/confirm-payment.use-case.js');

test('Payment flow initiates and confirms payment', () => {
  const store = [];
  const repository = {
    findAll: () => store,
    findById: (id) => store.find((payment) => payment.id === id),
    save: (payment) => { store.push(payment); return payment; },
    update: (payment) => { const index = store.findIndex((item) => item.id === payment.id); store[index] = payment; return payment; },
  };
  const initiated = new InitiatePaymentUseCase(repository).execute({
    sourceAccountId: 'acc-001',
    beneficiaryId: 'ben-001',
    amount: 10,
    currency: 'USD',
    description: 'test',
  });
  const confirmed = new ConfirmPaymentUseCase(repository).execute(initiated.paymentId, {
    authorizationCode: initiated.authorizationCode,
  });
  assert.equal(confirmed.status, 'CONFIRMED');
});
