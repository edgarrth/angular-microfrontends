const test = require('node:test');
const assert = require('node:assert/strict');
const { MarkNotificationReadUseCase } = require('../dist/application/use-cases/mark-notification-read.use-case.js');

test('MarkNotificationReadUseCase marks a notification as read', () => {
  const notification = { id: 'not-001', read: false };
  const repository = { markAsRead: () => ({ ...notification, read: true }) };
  const result = new MarkNotificationReadUseCase(repository).execute('not-001');
  assert.equal(result.read, true);
});
