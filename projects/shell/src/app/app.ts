import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthApiService, AuthSessionService } from 'shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  readonly session = inject(AuthSessionService).session;

  logout(): void {
    this.authApi.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }
}
