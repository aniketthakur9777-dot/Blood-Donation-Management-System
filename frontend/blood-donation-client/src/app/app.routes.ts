import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { AdminDashboard } from './admin/admin-dashboard';
import { DonorDashboard } from './donor/donor-dashboard';
import { DonorAdd } from './donor-add/donor-add';
import { DonorList } from './donor-list/donor-list';
import { InventoryComponent } from './inventory/inventory';
import { BloodRequestsComponent } from './blood-requests/blood-requests';
import { DonationHistoryComponent } from './donation-history/donation-history';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { donorGuard } from './guards/donor.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Role-based Dashboards
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [adminGuard] },
  { path: 'donor/dashboard', component: DonorDashboard, canActivate: [donorGuard] },

  // Fallback dashboard path
  { path: 'dashboard', redirectTo: 'admin/dashboard' },

  // Management Pages (Admin Restricted)
  { path: 'donor-list', component: DonorList, canActivate: [adminGuard] },
  { path: 'donor-add', component: DonorAdd, canActivate: [adminGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [adminGuard] },
  { path: 'requests', component: BloodRequestsComponent, canActivate: [authGuard] },
  { path: 'history', component: DonationHistoryComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];