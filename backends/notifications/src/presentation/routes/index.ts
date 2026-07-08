import { Router } from 'express';
import { MarkNotificationReadUseCase } from '../../application/use-cases/mark-notification-read.use-case';
import { RegisterPaymentEventUseCase } from '../../application/use-cases/register-payment-event.use-case';
import { JsonNotificationRepository } from '../../infrastructure/persistence/json-notification.repository';
import { ok } from '../http/response';

export const router = Router();
const repository = new JsonNotificationRepository();
const markAsRead = new MarkNotificationReadUseCase(repository);
const registerPaymentEvent = new RegisterPaymentEventUseCase(repository);

router.get('/health', (_request, response) => ok(response, { status: 'UP', service: 'notifications-api' }));
router.get('/notifications', (request, response) => {
  const limit = Number(request.query['limit'] ?? 20);
  ok(response, repository.findAll().slice(0, limit));
});
router.post('/notifications/:id/read', (request, response) => {
  try {
    ok(response, markAsRead.execute(request.params.id));
  } catch {
    response.status(404).json({ error: 'NOTIFICATION_NOT_FOUND' });
  }
});
router.post('/notifications/payment-events', (request, response) => ok(response, registerPaymentEvent.execute(request.body), 201));
