import { z } from 'zod';
import { PaymentRepository } from '../../domain/repositories/payment.repository';

export const ConfirmPaymentCommand = z.object({ authorizationCode: z.string().min(4) });
export type ConfirmPaymentCommand = z.infer<typeof ConfirmPaymentCommand>;

export class ConfirmPaymentUseCase {
  constructor(private readonly payments: PaymentRepository) {}

  execute(paymentId: string, command: ConfirmPaymentCommand) {
    const input = ConfirmPaymentCommand.parse(command);
    const payment = this.payments.findById(paymentId);
    if (!payment) {
      throw new Error('PAYMENT_NOT_FOUND');
    }
    if (payment.authorizationCode && payment.authorizationCode !== input.authorizationCode) {
      throw new Error('INVALID_AUTHORIZATION_CODE');
    }
    const confirmed = { ...payment, status: 'CONFIRMED' as const, confirmedAt: new Date().toISOString() };
    return this.payments.update(confirmed);
  }
}
