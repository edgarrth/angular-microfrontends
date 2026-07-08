import { z } from 'zod';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

export const RegisterPaymentEventCommand = z.object({
  paymentId: z.string().min(1),
  status: z.string().min(1),
  message: z.string().min(1),
});

export class RegisterPaymentEventUseCase {
  constructor(private readonly notifications: NotificationRepository) {}

  execute(command: unknown) {
    const event = RegisterPaymentEventCommand.parse(command);
    return this.notifications.save({
      title: `Pago ${event.status}`,
      message: `${event.message} (${event.paymentId})`,
    });
  }
}
