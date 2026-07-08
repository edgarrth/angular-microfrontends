import { z } from 'zod';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

const PaymentStatusSchema = z.enum(['INITIATED', 'CONFIRMED', 'FAILED']);

type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  INITIATED: 'iniciado',
  CONFIRMED: 'confirmado',
  FAILED: 'fallido',
};

export const RegisterPaymentEventCommand = z.object({
  paymentId: z.string().min(1),
  status: PaymentStatusSchema,
  message: z.string().min(1),
  amount: z.number().optional(),
  currency: z.string().optional(),
});

type RegisterPaymentEventCommand = z.infer<typeof RegisterPaymentEventCommand>;

export class RegisterPaymentEventUseCase {
  constructor(private readonly notifications: NotificationRepository) {}

  execute(command: unknown) {
    const event = RegisterPaymentEventCommand.parse(command);

    return this.notifications.save({
      title: `Pago ${PAYMENT_STATUS_LABELS[event.status]}`,
      message: this.buildNotificationMessage(event),
    });
  }

  private buildNotificationMessage(event: RegisterPaymentEventCommand): string {
    const amountDescription =
      event.amount !== undefined && event.currency
        ? ` · ${event.currency} ${event.amount.toFixed(2)}`
        : '';

    return `${event.message}${amountDescription} (${event.paymentId})`;
  }
}
