import { NotificationRepository } from '../../domain/repositories/notification.repository';

export class MarkNotificationReadUseCase {
  constructor(private readonly notifications: NotificationRepository) {}

  execute(id: string) {
    const notification = this.notifications.markAsRead(id);
    if (!notification) {
      throw new Error('NOTIFICATION_NOT_FOUND');
    }
    return notification;
  }
}
