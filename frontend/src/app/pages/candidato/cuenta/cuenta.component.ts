import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  perfil: any = {};
  copia: any = {};

  editando = false;

  mostrarModal = false;
  mostrarExito = false;
  mostrarError = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const token = localStorage.getItem('token');
    this.http.get<any>('http://localhost:3000/api/candidatos/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.perfil = res;
        this.copia = { ...res };
      },
      error: (err) => console.error('Error al cargar perfil', err)
    });
  }

  activarEdicion() {
    this.editando = true;
  }

  cancelar() {
    this.perfil = { ...this.copia };
    this.editando = false;
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModales() {
    this.mostrarModal = false;
    this.mostrarExito = false;
    this.mostrarError = false;
  }

  confirmarCambios() {
    this.mostrarModal = false;
    const token = localStorage.getItem('token');

    this.http.put('http://localhost:3000/api/candidatos/perfil', this.perfil, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.editando = false;
        this.mostrarExito = true;
        this.cargarPerfil();
      },
      error: () => {
        this.mostrarError = true;
      }
    });
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}