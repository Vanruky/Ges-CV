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

  estamentoSeleccionado: string = '';
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
    console.log('Cargos encontrados:', this.cargosFiltrados.length);
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

    form.append('nombre', this.perfil.nombre || 'SIN_NOMBRE');
    form.append('apellido', this.perfil.apellido_paterno || 'SIN_APELLIDO');
    form.append('cargo', cargoObj?.nombre_cargo || 'SIN_CARGO');


    form.append('id_cargo', this.cargoIdSeleccionado.toString());

    //colocar los estamentos directamente porque no estan definidos en otro lado
    let idEstamentoFinal = '';
    const nombreEst = cargoObj?.nombre_estamento?.toUpperCase().trim();

    if (nombreEst === 'PROFESIONAL') idEstamentoFinal = '1';
    else if (nombreEst === 'TECNICO') idEstamentoFinal = '2';
    else if (nombreEst === 'AUXILIAR') idEstamentoFinal = '3';
    else if (nombreEst === 'MEDICO') idEstamentoFinal = '4';
    else if (nombreEst === 'ADMINISTRATIVO') idEstamentoFinal = '5';

    else if (cargoObj?.id_estamento) idEstamentoFinal = cargoObj.id_estamento.toString();

    form.append('id_estamento', idEstamentoFinal);
    
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
        console.error("Error detectado:", err);
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
