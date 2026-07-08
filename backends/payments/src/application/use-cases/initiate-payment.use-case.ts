import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { Payment } from '../../domain/entities/payment';
import { PaymentRepository } from '../../domain/repositories/payment.repository';

export const InitiatePaymentCommand = z.object({
  sourceAccountId: z.string().min(1),
  beneficiaryId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(['USD', 'PEN']),
  description: z.string().min(1),
});
export type InitiatePaymentCommand = z.infer<typeof InitiatePaymentCommand>;

export class InitiatePaymentUseCase {
  constructor(private readonly payments: PaymentRepository) {}

  execute(command: InitiatePaymentCommand) {
    const input = InitiatePaymentCommand.parse(command);
    const authorizationCode = String(Math.floor(100000 + Math.random() * 900000));
    const payment: Payment = {
      id: `pay-${randomUUID().slice(0, 8)}`,
      sourceAccountId: input.sourceAccountId,
      beneficiaryId: input.beneficiaryId,
      beneficiaryName: input.beneficiaryId === 'ben-001' ? 'Servicios Cloud SAC' : 'Beneficiario Mock',
      amount: input.amount,
      currency: input.currency,
      status: 'INITIATED',
      description: input.description,
      createdAt: new Date().toISOString(),
      authorizationCode,
    };
    this.payments.save(payment);
    return { paymentId: payment.id, status: payment.status, authorizationCode };
  }
}
