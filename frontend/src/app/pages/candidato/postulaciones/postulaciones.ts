import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './postulaciones.html'
})
export class PostulacionesComponent {

  cargo = '';
  archivo: File | null = null;
  nombreArchivo = '';

  constructor(private http: HttpClient) {}

  onFile(event: any) {
    this.archivo = event.target.files[0];
    this.nombreArchivo = this.archivo?.name || '';
  }

  postular() {
    if (!this.archivo) {
      alert("Debe subir un PDF");
      return;
    }

    const form = new FormData();
    form.append('cargo', this.cargo);
    form.append('cv', this.archivo);

    this.http.post<any>('http://localhost:3000/api/postulaciones', form, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe(res => {
      alert(res.mensaje);
    });
  }

  logout() {
    localStorage.clear();
  }
}