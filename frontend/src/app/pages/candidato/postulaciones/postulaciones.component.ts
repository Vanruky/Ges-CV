import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {

  perfil: any = {};

  estamentos: string[] = [];
  cargos: string[] = [];

  estamentoSeleccionado = '';
  cargoSeleccionado = '';

  archivo: File | null = null;
  nombreArchivo = '';

  mostrarExito = false;
  mostrarError = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
    this.cargarOpcionesFormulario();
  }

  cargarOpcionesFormulario() {
    this.http.get<any>('http://localhost:3000/api/postulaciones/opciones').subscribe({
      next: (res) => {
        this.estamentos = res.estamentos || [];
        this.cargos = res.cargos || [];
      },
      error: (err) => {
        console.error('Error al cargar opciones de la base de datos:', err);
      }
    });
  }

  obtenerDatosUsuario() {
    const token = localStorage.getItem('token');
    this.http.get<any>('http://localhost:3000/api/candidatos/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => this.perfil = res,
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  onFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.mostrarError = true;
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarError = true;
        return;
      }
      this.archivo = file;
      this.nombreArchivo = file.name;
    }
  }

  postular() {
    if (!this.archivo || !this.cargoSeleccionado || !this.estamentoSeleccionado) {
      this.mostrarError = true;
      return;
    }

    const form = new FormData();
    form.append('cargo', this.cargoSeleccionado);
    form.append('estamento', this.estamentoSeleccionado);
    form.append('cv', this.archivo);

    const token = localStorage.getItem('token');
    this.http.post<any>('http://localhost:3000/api/postulaciones', form, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.mostrarExito = true;
        this.limpiarFormulario();
      },
      error: () => this.mostrarError = true
    });
  }

  cerrarModales() {
    this.mostrarExito = false;
    this.mostrarError = false;
  }

  limpiarFormulario() {
    this.estamentoSeleccionado = '';
    this.cargoSeleccionado = '';
    this.archivo = null;
    this.nombreArchivo = '';
  }

  irACuestionario() {
    window.open('https://forms.google.com', '_blank');
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}