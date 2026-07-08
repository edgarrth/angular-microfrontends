import { Injectable, OnDestroy, signal } from '@angular/core';
import { UserSession } from './models';

const SESSION_KEY = 'payment-processing.session';
const SESSION_COOKIE = 'payment_processing_session';
const SESSION_CHANGED_EVENT = 'payment-processing.session.changed';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

@Injectable({ providedIn: 'root' })
export class AuthSessionService implements OnDestroy {
  private readonly currentSession = signal<UserSession | null>(this.restore());
  private readonly syncIntervalId: number | null = this.startCrossOriginSync();

  readonly session = this.currentSession.asReadonly();

  constructor() {
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener(SESSION_CHANGED_EVENT, this.handleSessionChanged);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener(SESSION_CHANGED_EVENT, this.handleSessionChanged);

    if (this.syncIntervalId !== null) {
      window.clearInterval(this.syncIntervalId);
    }
  }

  login(session: UserSession): void {
    this.persist(session);
    this.currentSession.set(session);
    this.notifySessionChanged();
  }

  logout(): void {
    this.clearPersistence();
    this.currentSession.set(null);
    this.notifySessionChanged();
  }

  isAuthenticated(): boolean {
    return this.currentSession() !== null;
  }

  token(): string | null {
    return this.currentSession()?.accessToken ?? null;
  }

  private readonly handleStorageChange = (event: StorageEvent): void => {
    if (event.key === SESSION_KEY) {
      this.syncFromPersistence();
    }
  };

  private readonly handleSessionChanged = (): void => {
    this.syncFromPersistence();
  };

  private startCrossOriginSync(): number {
    return window.setInterval(() => this.syncFromPersistence(), 1000);
  }

  private syncFromPersistence(): void {
    const restored = this.restore();
    const current = this.currentSession();

    if (JSON.stringify(restored) !== JSON.stringify(current)) {
      this.currentSession.set(restored);
    }
  }

  private persist(session: UserSession): void {
    const serialized = JSON.stringify(session);
    localStorage.setItem(SESSION_KEY, serialized);
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(serialized)}; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
  }

  private clearPersistence(): void {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = `${SESSION_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0`;
  }

  private notifySessionChanged(): void {
    window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT));
  }

  private restore(): UserSession | null {
    const localSession = this.restoreFromLocalStorage();

    if (localSession) {
      return localSession;
    }

    const cookieSession = this.restoreFromCookie();

    if (cookieSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(cookieSession));
    }

    return cookieSession;
  }

  private restoreFromLocalStorage(): UserSession | null {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) {
      return null;
    }

    return this.parseSession(raw);
  }

  private restoreFromCookie(): UserSession | null {
    const cookie = document.cookie
      .split('; ')
      .find((item) => item.startsWith(`${SESSION_COOKIE}=`));

    if (!cookie) {
      return null;
    }

    return this.parseSession(decodeURIComponent(cookie.split('=')[1]));
  }

  private parseSession(raw: string): UserSession | null {
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      this.clearPersistence();
      return null;
    }
  }
}
