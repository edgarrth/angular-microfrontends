import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { PAYMENT_PROCESSING_API_CONFIG } from './api-config';
import { AuthSessionService } from './auth-session.service';
import { ApiResult, LoginCredentials, LoginResponse, UserSession } from './models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PAYMENT_PROCESSING_API_CONFIG);
  private readonly session = inject(AuthSessionService);

  login(credentials: LoginCredentials): Observable<UserSession> {
    return this.http
      .post<ApiResult<LoginResponse>>(`${this.config.authApiUrl}/auth/login`, credentials)
      .pipe(
        map((result) => ({
          userId: result.data.user.id,
          username: result.data.user.username,
          displayName: result.data.user.displayName,
          roles: result.data.user.roles,
          accessToken: result.data.accessToken,
        })),
        tap((session) => this.session.login(session)),
      );
  }

  logout(): Observable<void> {
    return this.http.post<ApiResult<{ status: string }>>(`${this.config.authApiUrl}/auth/logout`, {}).pipe(
      map(() => void 0),
      catchError(() => of(void 0)),
      tap(() => this.session.logout()),
    );
  }
}
