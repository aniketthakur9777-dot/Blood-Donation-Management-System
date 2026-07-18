import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { DonorAdd } from './donor-add/donor-add';
import { DonorList } from './donor-list/donor-list';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },

  { path: 'donor-list', component: DonorList },
  { path: 'donor-add', component: DonorAdd },

  { path: '**', redirectTo: 'login' }
];