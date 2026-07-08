import { Router } from 'express';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { JsonUserRepository } from '../../infrastructure/persistence/json-user.repository';
import { ok } from '../http/response';

export const router = Router();
const login = new LoginUseCase(new JsonUserRepository());

router.get('/health', (_request, response) => ok(response, { status: 'UP', service: 'authentication-api' }));

router.post('/auth/login', (request, response) => {
  try {
    ok(response, login.execute(request.body));
  } catch {
    response.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }
});

router.get('/auth/me', (_request, response) =>
  ok(response, {
    id: 'usr-001',
    username: 'edgar',
    displayName: 'Edgar Rodriguez',
    roles: ['PAYMENT_OPERATOR', 'PAYMENT_APPROVER'],
  }),
);

router.post('/auth/logout', (_request, response) => ok(response, { status: 'LOGGED_OUT' }));
