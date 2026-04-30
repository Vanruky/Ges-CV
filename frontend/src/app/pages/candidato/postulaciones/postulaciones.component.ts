import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {
  perfil: any = { numero_identificacion: '', nombre: '', apellido_paterno: '', apellido_materno: '' };
  estamentos: string[] = [];
  cargosFiltrados: any[] = [];
  private todasLasOpciones: any[] = [];

  estamentoSeleccionado = '';
  cargoIdSeleccionado = '';
  archivo: File | null = null;
  nombreArchivo = '';
  mostrarExito = false;
  mostrarError = false;
  mensajeError = '';

  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
    this.cargarOpcionesFormulario();
  }

  obtenerDatosUsuario() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(`${this.API_URL}/candidatos/perfil`, { headers }).subscribe({
      next: (res) => this.perfil = res,
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  cargarOpcionesFormulario() {
    this.http.get<any[]>(`${this.API_URL}/postulaciones/opciones`).subscribe({
      next: (res) => {
        this.todasLasOpciones = res;
        this.estamentos = [...new Set(res.map(item => item.nombre_estamento))];
      },
      error: (err) => console.error('Error al cargar opciones:', err)
    });
  }

  onEstamentoChange() {
    this.cargoIdSeleccionado = '';
    this.cargosFiltrados = this.todasLasOpciones.filter(
      item => item.nombre_estamento === this.estamentoSeleccionado
    );
  }

  onFile(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.archivo = file;
      this.nombreArchivo = file.name;
    }
  }

  postular() {
    if (!this.archivo || !this.cargoIdSeleccionado) return;

    const cargoObj = this.todasLasOpciones.find(c => c.id_cargo == this.cargoIdSeleccionado);
    const form = new FormData();
    form.append('id_cargo', this.cargoIdSeleccionado);
    form.append('id_estamento', cargoObj.id_estamento);
    form.append('cv', this.archivo); 

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.API_URL}/postulaciones`, form, { headers }).subscribe({
      next: () => { 
        this.mostrarExito = true; 
        this.limpiarFormulario(); 
      },
      error: (err) => { 
        this.mostrarError = true; 
        this.mensajeError = err.error?.mensaje || 'Error al postular'; 
      }
    });
  }

  irACuestionario() { 
    window.open('https://forms.google.com', '_blank');
  }

  cerrarModales() { 
    this.mostrarExito = false; 
    this.mostrarError = false; 
  }

  limpiarFormulario() {
    this.estamentoSeleccionado = '';
    this.cargoIdSeleccionado = '';
    this.archivo = null;
    this.nombreArchivo = '';
  }
}