import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Observable, shareReplay, timer, switchMap } from 'rxjs';
import { ApiResult, PAYMENT_PROCESSING_API_CONFIG } from 'shared';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationSummary {
  unread: number;
  notifications: NotificationItem[];
}

@Component({
  selector: 'notifications-home-section',
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, RouterLink],
  template: `
    <section class="mfe-home-section notifications-section">
      <header>
        <span class="remote-label">Notifications MFE</span>
        <h2>Bandeja y alertas</h2>
        <p>Sección federada expuesta por el Microfrontend de Notifications.</p>
      </header>

      <ng-container *ngIf="summary$ | async as summary; else loading">
        <div class="metric">
          <strong>{{ summary.unread }}</strong>
          <small>Notificaciones pendientes</small>
        </div>

        <ul *ngIf="summary.notifications.length > 0; else emptyState">
          <li *ngFor="let notification of summary.notifications">
            <span class="dot" [class.read]="notification.read"></span>
            <div>
              <strong>{{ notification.title }}</strong>
              <small>{{ notification.createdAt | date: 'short' }}</small>
            </div>
          </li>
        </ul>

        <ng-template #emptyState>
          <p class="loading">No existen notificaciones registradas.</p>
        </ng-template>

        <a routerLink="/notifications">Abrir bandeja</a>
      </ng-container>

      <ng-template #loading>
        <p class="loading">Cargando notificaciones...</p>
      </ng-template>
    </section>
  `,
  styles: [`
    .mfe-home-section {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 22px;
      box-shadow: 0 14px 36px rgb(16 24 40 / 8%);
      display: grid;
      gap: 1rem;
      min-height: 260px;
      padding: 1.5rem;
    }

    .remote-label {
      color: #027a48;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    h2 {
      color: #101828;
      font-size: 1.45rem;
      margin: 0.35rem 0;
    }

    p,
    small {
      color: #667085;
    }

    p {
      margin: 0;
    }

    .metric {
      align-items: center;
      background: #ecfdf3;
      border-radius: 16px;
      display: flex;
      gap: 0.75rem;
      padding: 0.9rem;
    }

    .metric strong {
      color: #027a48;
      font-size: 1.8rem;
    }

    ul {
      display: grid;
      gap: 0.75rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      align-items: flex-start;
      display: flex;
      gap: 0.7rem;
    }

    li div {
      display: grid;
      gap: 0.2rem;
    }

    li strong {
      color: #101828;
    }

    .dot {
      background: #12b76a;
      border-radius: 999px;
      flex: 0 0 auto;
      height: 0.7rem;
      margin-top: 0.25rem;
      width: 0.7rem;
    }

    .dot.read {
      background: #98a2b3;
    }

    a {
      align-self: end;
      background: #039855;
      border-radius: 999px;
      color: #ffffff;
      font-weight: 800;
      justify-self: start;
      padding: 0.7rem 1rem;
      text-decoration: none;
    }

    .loading {
      background: #f9fafb;
      border-radius: 14px;
      padding: 1rem;
    }
  `],
})
export class NotificationsHomeSectionComponent {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);

  readonly summary$: Observable<NotificationSummary> = timer(0, 5000).pipe(
    switchMap(() =>
      this.http.get<ApiResult<NotificationItem[]>>(`${this.config.notificationsApiUrl}/notifications?limit=3`),
    ),
    map((result) => ({
      unread: result.data.filter((notification) => !notification.read).length,
      notifications: result.data,
    })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
