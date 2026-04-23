import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent {

  tituloPagina: string = 'GES-CV';

  onActivate(componentReference: any) {
    const componentName = componentReference.constructor.name;

    if (componentName === 'AdminHomeComponent') {
      this.tituloPagina = 'Administración';
    } else if (componentName === 'ReportsComponent') {
      this.tituloPagina = 'Reportes';
    } else {
      this.tituloPagina = 'GES-CV';
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

}