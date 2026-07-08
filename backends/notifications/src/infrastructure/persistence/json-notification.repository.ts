import { randomUUID } from 'node:crypto';
import { Notification } from '../../domain/entities/notification';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { JsonDatasetReader } from './json-dataset-reader';

export class JsonNotificationRepository implements NotificationRepository {
  private readonly notifications: Notification[];

  constructor(reader = new JsonDatasetReader()) {
    this.notifications = reader.read<Notification>('notifications.json');
  }

  findAll(): Notification[] {
    return [...this.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  markAsRead(id: string): Notification | undefined {
    const notification = this.notifications.find((item) => item.id === id);
    if (notification) {
      notification.read = true;
    }
    return notification;
  }

  save(input: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
    const notification = { id: `not-${randomUUID().slice(0, 8)}`, read: false, createdAt: new Date().toISOString(), ...input };
    this.notifications.push(notification);
    return notification;
  }
}
