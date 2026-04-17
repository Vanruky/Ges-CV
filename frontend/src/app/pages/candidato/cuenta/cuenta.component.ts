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
  editando = false;
  copia: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/candidatos/perfil', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe(res => {
      this.perfil = res;
      this.copia = { ...res };
    });
  }

  activarEdicion() {
    this.editando = true;
  }

  cancelar() {
    this.perfil = { ...this.copia };
    this.editando = false;
  }

  confirmar() {
    this.http.put('http://localhost:3000/api/candidatos/perfil', this.perfil, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe(() => {
      alert('Actualizado correctamente');
      this.editando = false;
    });
  }

  logout() {
    localStorage.clear();
  }
}