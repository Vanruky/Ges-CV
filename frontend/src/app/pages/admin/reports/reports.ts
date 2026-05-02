import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../table/table';
import { FormsModule } from '@angular/forms';
import { ReportsService, Reporte } from '@services/reports.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

type ReporteUI = Reporte & {
  tipo_formateado: string;
};


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, TableComponent, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class ReportsComponent implements OnInit {

  reportes: ReporteUI[] = [];

  filtroTexto = '';
  desde = '';
  hasta = '';

  private filtroSubject = new Subject<void>();

  showModal = false;
  showExportMenu = false;

  loading = false;

  nuevoReporte: Partial<Reporte> = {
    tipo_reporte: '',
    descripcion: ''
  };

  archivoSeleccionado: File | null = null;
  archivoNombre = '';

  toast = {
    visible: false,
    mensaje: '',
    tipo: 'success' as 'success' | 'error' | 'warning'
  };

  constructor(private reportsService: ReportsService) { }

  ngOnInit(): void {
    this.cargarReportes();

    this.filtroSubject
      .pipe(debounceTime(400))
      .subscribe(() => this.cargarReportes());
  }


  onFiltroChange() {
    this.filtroSubject.next();
  }

  onFechaChange() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.loading = true;

    this.reportsService.getReportes({
      texto: this.filtroTexto || '',
      desde: this.desde || '',
      hasta: this.hasta || ''
    }).subscribe({
      next: (data) => {
        this.reportes = data.map(r => ({
          ...r,
          tipo_formateado: this.formatearTipo(r.tipo_reporte)
        }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.mostrarToast('Error al cargar reportes', 'error');
      }
    });
  }


  exportarExcel() {
    this.reportsService.exportExcel({
      texto: this.filtroTexto || '',
      desde: this.desde || '',
      hasta: this.hasta || ''
    }).subscribe(blob => {
      this.download(blob, 'reportes.xlsx');
    });
  }

  exportarPDF() {
    this.reportsService.exportPDF({
      texto: this.filtroTexto || '',
      desde: this.desde || '',
      hasta: this.hasta || ''
    }).subscribe(blob => {
      this.download(blob, 'reportes.pdf');
    });
  }

  private download(blob: Blob, name: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  toggleExportMenu() {
    if (!this.reportes.length) {
      this.mostrarToast('No hay reportes para exportar', 'warning');
      return;
    }

    this.showExportMenu = !this.showExportMenu;
  }

  abrirModal() {
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;

    this.nuevoReporte = {
      tipo_reporte: '',
      descripcion: ''
    };

    this.archivoSeleccionado = null;
    this.archivoNombre = '';
  }

  generarReporte() {
    if (!this.nuevoReporte.tipo_reporte) {
      this.mostrarToast('Debes seleccionar un tipo de reporte', 'warning');
      return;
    }

    this.loading = true;

    const formData = new FormData();

    formData.append('tipo_reporte', this.nuevoReporte.tipo_reporte);
    formData.append('descripcion', this.nuevoReporte.descripcion || '');

    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
    }

    this.reportsService.createReporte(formData).subscribe({
      next: () => {
        this.mostrarToast('Reporte creado correctamente', 'success');
        this.cerrarModal();
        this.cargarReportes();
        this.loading = false;
      },
      error: () => {
        this.mostrarToast('Error al crear reporte', 'error');
        this.loading = false;
      }
    });
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.mostrarToast('Archivo muy grande (máx 5MB)', 'error');
      return;
    }

    this.archivoSeleccionado = file;
    this.archivoNombre = file.name;
  }

  eliminarArchivo() {
    this.archivoSeleccionado = null;
    this.archivoNombre = '';
  }


  mostrarToast(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.toast = {
      visible: true,
      mensaje,
      tipo
    };

    setTimeout(() => {
      this.toast.visible = false;
    }, 3000);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.export-dropdown')) {
      this.showExportMenu = false;
    }
  }


  private formatearTipo(tipo: string): string {
    if (!tipo) return '';

    return tipo
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace('Rotacion', 'Rotación')
      .replace('Postulacion', 'Postulación');
  }

}