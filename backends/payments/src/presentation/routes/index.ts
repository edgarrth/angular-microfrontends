import { Router } from 'express';
import { ConfirmPaymentUseCase } from '../../application/use-cases/confirm-payment.use-case';
import { InitiatePaymentUseCase } from '../../application/use-cases/initiate-payment.use-case';
import { JsonPaymentRepository } from '../../infrastructure/persistence/json-payment.repository';
import { ok } from '../http/response';

export const router = Router();
const repository = new JsonPaymentRepository();
const initiate = new InitiatePaymentUseCase(repository);
const confirm = new ConfirmPaymentUseCase(repository);

router.get('/health', (_request, response) => ok(response, { status: 'UP', service: 'payments-api' }));
router.get('/payments', (_request, response) => ok(response, repository.findAll()));
router.get('/payments/history', (request, response) => {
  const limit = Number(request.query['limit'] ?? 20);
  ok(response, repository.findAll().slice(0, limit));
});
router.get('/payments/:id', (request, response) => {
  const payment = repository.findById(request.params.id);
  payment ? ok(response, payment) : response.status(404).json({ error: 'PAYMENT_NOT_FOUND' });
});
router.post('/payments/initiate', (request, response) => ok(response, initiate.execute(request.body), 201));
router.post('/payments/:id/confirm', (request, response) => {
  try {
    ok(response, confirm.execute(request.params.id, request.body));
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'PAYMENT_CONFIRMATION_FAILED' });
  }
});
