import { AsyncPipe, NgComponentOutlet, NgIf } from '@angular/common';
import { Component, Type, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { startWith } from 'rxjs';
import {
  AuthSessionService,
  EventBusService,
  LoginPanelComponent,
  PaymentEvent,
} from 'shared';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, LoginPanelComponent, NgComponentOutlet, NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly auth = inject(AuthSessionService);
  private readonly eventBus = inject(EventBusService);

  readonly session = this.auth.session;

  readonly accountsHomeSection = this.loadRemoteHomeSection(
    'accounts',
    'AccountsHomeSectionComponent',
  );

  readonly paymentsHomeSection = this.loadRemoteHomeSection(
    'payments',
    'PaymentsHomeSectionComponent',
  );

  readonly notificationsHomeSection = this.loadRemoteHomeSection(
    'notifications',
    'NotificationsHomeSectionComponent',
  );

  readonly events$ = this.eventBus.events$.pipe(
    startWith<PaymentEvent>({
      type: 'NOTIFICATION_RECEIVED',
      message: 'Event Bus listo para recibir eventos de los Microfrontends.',
      occurredAt: new Date().toISOString(),
    }),
  );

  private loadRemoteHomeSection(remoteName: string, exportName: string): Promise<Type<unknown>> {
    return loadRemoteModule(remoteName, './HomeSection').then(
      (remoteModule) => remoteModule[exportName] as Type<unknown>,
    );
  }
}
