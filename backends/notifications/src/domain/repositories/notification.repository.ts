import { Notification } from '../entities/notification';

export interface NotificationRepository {
  findAll(): Notification[];
  markAsRead(id: string): Notification | undefined;
  save(input: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification;
}
