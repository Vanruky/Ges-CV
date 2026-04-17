import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { CandidateLayoutComponent } from './pages/candidato/layout/candidate-layout';
import { HomeComponent } from './pages/candidato/home/home';
import { PostulacionesComponent } from './pages/candidato/postulaciones/postulaciones';
import { CuentaComponent } from './pages/candidato/cuenta/cuenta.component';

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
  { path: '**', redirectTo: '' }
];