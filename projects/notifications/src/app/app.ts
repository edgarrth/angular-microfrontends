import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  timer,
} from 'rxjs';
import {
  ApiResult,
  AuthApiService,
  AuthSessionService,
  EventBusService,
  LoginPanelComponent,
  PAYMENT_PROCESSING_API_CONFIG,
  PaymentEvent,
} from 'shared';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

@Component({
  selector: 'notifications-root',
  imports: [AsyncPipe, DatePipe, LoginPanelComponent, NgFor, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);
  private readonly eventBus = inject(EventBusService);
  private readonly auth = inject(AuthSessionService);
  private readonly authApi = inject(AuthApiService);

  private readonly refreshNotifications$ = new Subject<void>();

  readonly session = this.auth.session;

  logout(): void {
    this.authApi.logout().subscribe();
  }

  private readonly paymentEvents$ = this.eventBus.events$.pipe(
    filter(
      (event) =>
        event.type === 'PAYMENT_INITIATED' ||
        event.type === 'PAYMENT_CONFIRMED' ||
        event.type === 'PAYMENT_FAILED' ||
        event.type === 'NOTIFICATION_RECEIVED',
    ),
    map(() => void 0),
  );

  readonly notifications$: Observable<NotificationItem[]> = merge(
    timer(0, 5000).pipe(map(() => void 0)),
    this.refreshNotifications$,
    this.paymentEvents$,
  ).pipe(
    switchMap(() =>
      this.http.get<ApiResult<NotificationItem[]>>(
        `${this.config.notificationsApiUrl}/notifications`,
      ),
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
      .post<ApiResult<NotificationItem>>(
        `${this.config.notificationsApiUrl}/notifications/${notification.id}/read`,
        {},
      )
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
