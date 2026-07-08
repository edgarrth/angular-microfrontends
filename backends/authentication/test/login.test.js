const test = require('node:test');
const assert = require('node:assert/strict');
const { LoginUseCase } = require('../dist/application/use-cases/login.use-case.js');

test('LoginUseCase authenticates a valid payment operator', () => {
  const repository = {
    findByUsername: () => ({
      id: 'usr-001',
      username: 'edgar',
      password: 'demo',
      displayName: 'Edgar Rodriguez',
      roles: ['PAYMENT_OPERATOR'],
    }),
  };
  const result = new LoginUseCase(repository).execute({ username: 'edgar', password: 'demo' });
  assert.equal(result.user.username, 'edgar');
  assert.ok(result.accessToken.length > 20);
});
