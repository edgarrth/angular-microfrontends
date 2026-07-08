import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PaymentEvent } from './models';

const PAYMENT_EVENT_NAME = 'payment-processing:event';

@Injectable({ providedIn: 'root' })
export class EventBusService implements OnDestroy {
  private readonly eventsSubject = new Subject<PaymentEvent>();
  private readonly listener = (event: Event) => {
    const customEvent = event as CustomEvent<PaymentEvent>;
    if (customEvent.detail) {
      this.eventsSubject.next(customEvent.detail);
    }
  };

  readonly events$: Observable<PaymentEvent> = this.eventsSubject.asObservable();

  constructor() {
    window.addEventListener(PAYMENT_EVENT_NAME, this.listener);
  }

  publish(event: PaymentEvent): void {
    window.dispatchEvent(new CustomEvent(PAYMENT_EVENT_NAME, { detail: event }));
  }

  ngOnDestroy(): void {
    window.removeEventListener(PAYMENT_EVENT_NAME, this.listener);
    this.eventsSubject.complete();
  }
}
