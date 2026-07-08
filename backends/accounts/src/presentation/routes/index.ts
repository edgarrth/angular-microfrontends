import { Router } from 'express';
import { GetAccountSummaryUseCase } from '../../application/use-cases/get-account-summary.use-case';
import { RegisterBeneficiaryUseCase } from '../../application/use-cases/register-beneficiary.use-case';
import { JsonAccountRepository } from '../../infrastructure/persistence/json-account.repository';
import { ok } from '../http/response';

export const router = Router();
const repository = new JsonAccountRepository();
const summary = new GetAccountSummaryUseCase(repository);
const registerBeneficiary = new RegisterBeneficiaryUseCase(repository);

router.get('/health', (_request, response) => ok(response, { status: 'UP', service: 'accounts-api' }));
router.get('/accounts', (_request, response) => ok(response, repository.findAccounts()));
router.get('/accounts/summary', (_request, response) => ok(response, summary.execute()));
router.get('/accounts/:id/cards', (request, response) => ok(response, repository.findCards(request.params.id)));
router.get('/beneficiaries', (_request, response) => ok(response, repository.findBeneficiaries()));
router.post('/beneficiaries', (request, response) => ok(response, registerBeneficiary.execute(request.body), 201));
