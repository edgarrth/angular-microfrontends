import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'accounts',
    loadComponent: () => loadRemoteModule('accounts', './Component').then((m) => m.App),
  },
  {
    path: 'payments',
    loadComponent: () => loadRemoteModule('payments', './Component').then((m) => m.App),
  },
  {
    path: 'notifications',
    loadComponent: () => loadRemoteModule('notifications', './Component').then((m) => m.App),
  },
  { path: '**', redirectTo: '' },
];
