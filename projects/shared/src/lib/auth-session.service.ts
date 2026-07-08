import { Injectable, signal } from '@angular/core';
import { UserSession } from './models';

const SESSION_KEY = 'payment-processing.session';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly currentSession = signal<UserSession | null>(this.restore());

  readonly session = this.currentSession.asReadonly();

  login(session: UserSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.currentSession.set(session);
    window.dispatchEvent(new StorageEvent('storage', { key: SESSION_KEY }));
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentSession.set(null);
    window.dispatchEvent(new StorageEvent('storage', { key: SESSION_KEY }));
  }

  isAuthenticated(): boolean {
    return this.currentSession() !== null;
  }

  token(): string | null {
    return this.currentSession()?.accessToken ?? null;
  }

  private restore(): UserSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
