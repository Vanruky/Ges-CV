import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  nombre: string = '';
  postulaciones: any[] = [];
  cargando: boolean = true;
  error: string = '';

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
        this.nombre = res.usuario?.nombre_completo || 'Usuario';
        this.postulaciones = res.postulaciones || [];
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar datos';
        this.cargando = false;
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}