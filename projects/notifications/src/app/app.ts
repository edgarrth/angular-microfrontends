import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { map, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { ApiResult, EventBusService, PAYMENT_PROCESSING_API_CONFIG, PaymentEvent } from 'shared';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

@Component({
  selector: 'notifications-root',
  imports: [AsyncPipe, DatePipe, NgFor, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);
  private readonly eventBus = inject(EventBusService);

  private readonly refreshNotifications$ = new Subject<void>();

  readonly notifications$: Observable<NotificationItem[]> = this.refreshNotifications$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.http.get<ApiResult<NotificationItem[]>>(`${this.config.notificationsApiUrl}/notifications`),
    ),
    map((result) => result.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly liveEvents$ = this.eventBus.events$.pipe(
    startWith<PaymentEvent>({
      type: 'NOTIFICATION_RECEIVED',
      message: 'Esperando eventos de pagos...',
      occurredAt: new Date().toISOString(),
    }),
  );

  markAsRead(notification: NotificationItem): void {
    this.http
      .post<ApiResult<NotificationItem>>(`${this.config.notificationsApiUrl}/notifications/${notification.id}/read`, {})
      .subscribe(() => {
        this.eventBus.publish({
          type: 'NOTIFICATION_RECEIVED',
          message: `Notificación marcada como leída: ${notification.title}`,
          occurredAt: new Date().toISOString(),
        });

        this.refreshNotifications$.next();
      });
  }
}
