import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nombre: string = '';
  postulaciones: any[] = [];

  cuestionarioRealizado: number = 0; 
  fechaCuestionario: string | null = null;

  cargando: boolean = true;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarHome();
  }

  cargarHome() {
    this.http.get<any>('http://localhost:3000/api/dashboard', {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken()
      }
    }).subscribe({
      next: (res) => {
        this.nombre = res.usuario?.nombre_completo || 'Candidato';
        this.postulaciones = res.postulaciones || [];

        this.cuestionarioRealizado = res.cuestionario?.realizado ?? 0;
        this.fechaCuestionario = res.cuestionario?.fecha || null;
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.cargando = false;
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}