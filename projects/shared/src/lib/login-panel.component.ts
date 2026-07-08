import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from './auth-api.service';
import { UserSession } from './models';

@Component({
  selector: 'pp-login-panel',
  imports: [FormsModule, NgIf],
  template: `
    <section class="login-panel">
      <div class="login-card">
        <p class="eyebrow">Sesión compartida</p>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>

        <label>
          Usuario
          <input [(ngModel)]="username" autocomplete="username" placeholder="edgar" />
        </label>

        <label>
          Password
          <input
            [(ngModel)]="password"
            autocomplete="current-password"
            placeholder="demo"
            type="password"
            (keyup.enter)="login()"
          />
        </label>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

        <button type="button" [disabled]="isLoading" (click)="login()">
          {{ isLoading ? 'Validando...' : 'Iniciar sesión' }}
        </button>

        <small>Credenciales demo: <strong>edgar</strong> / <strong>demo</strong></small>
      </div>
    </section>
  `,
  styles: [
    `
      .login-panel {
        display: grid;
        min-height: 420px;
        place-items: center;
        padding: 2rem;
      }

      .login-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
        display: grid;
        gap: 0.9rem;
        max-width: 440px;
        padding: 2rem;
        width: 100%;
      }

      .eyebrow {
        color: #475569;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        margin: 0;
        text-transform: uppercase;
      }

      h2,
      p {
        margin: 0;
      }

      label {
        color: #334155;
        display: grid;
        font-weight: 600;
        gap: 0.35rem;
      }

      input {
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        font: inherit;
        padding: 0.75rem 0.9rem;
      }

      button {
        background: #0f172a;
        border: 0;
        border-radius: 12px;
        color: #ffffff;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        padding: 0.85rem 1rem;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      small {
        color: #64748b;
      }

      .error {
        background: #fee2e2;
        border-radius: 12px;
        color: #991b1b;
        padding: 0.75rem;
      }
    `,
  ],
})
export class LoginPanelComponent {
  private readonly auth = inject(AuthApiService);

  @Input() title = 'Iniciar sesión';
  @Input() description =
    'Autentícate una sola vez para compartir la sesión entre el Shell y todos los Microfrontends.';

  @Output() loggedIn = new EventEmitter<UserSession>();

  username = 'edgar';
  password = 'demo';
  isLoading = false;
  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Ingresa usuario y password.';
      return;
    }

    this.isLoading = true;

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (session) => {
        this.isLoading = false;
        this.loggedIn.emit(session);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Credenciales inválidas o Authentication API no disponible.';
      },
    });
  }
}
