import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { authGuard } from 'shared';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'accounts',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('accounts', './Component').then((m) => m.App),
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('payments', './Component').then((m) => m.App),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('notifications', './Component').then((m) => m.App),
  },
  { path: '**', redirectTo: '' },
];
