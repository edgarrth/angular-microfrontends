import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthSessionService, LoginPanelComponent } from 'shared';

@Component({
  selector: 'app-login',
  imports: [LoginPanelComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly auth = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  continueAfterLogin(): void {
    this.router.navigateByUrl(this.returnUrl);
  }
}
