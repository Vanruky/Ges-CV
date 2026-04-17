import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-layout.html', 
  styleUrls: ['./candidate-layout.css']
})
export class CandidateLayoutComponent {
  tituloPagina: string = 'GES-CV';

  onActivate(componentReference: any) {
    const componentName = componentReference.constructor.name;
    
    if (componentName === 'CuentaComponent') {
      this.tituloPagina = 'Mis Datos';
    } else if (componentName === 'HomeComponent') {
      this.tituloPagina = 'Inicio';
    } else if (componentName === 'PostulacionesComponent') {
      this.tituloPagina = 'Postulaciones';
    } else {
      this.tituloPagina = 'GES-CV';
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}