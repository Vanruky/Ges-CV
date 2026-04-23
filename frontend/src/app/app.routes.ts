import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { CandidateLayoutComponent } from './pages/candidato/layout/candidate-layout';
import { HomeComponent } from './pages/candidato/home/home.component';
import { PostulacionesComponent } from './pages/candidato/postulaciones/postulaciones.component';
import { CuentaComponent } from './pages/candidato/cuenta/cuenta.component';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout';

export const routes: Routes = [

  { path: '', component: Login },
  { path: 'register', component: Register },

  {
    path: 'candidato',
    component: CandidateLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'cuenta', component: CuentaComponent },
      { path: 'postulaciones', component: PostulacionesComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/admin/home/home').then(m => m.AdminHomeComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/admin/reports/reports').then(m => m.ReportsComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  { path: '**', redirectTo: '' }
];