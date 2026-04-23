import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../table/table';
import { FormsModule } from '@angular/forms';
import { ReportsService, Reporte } from '@services/reports.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ReporteUI = Reporte & {
  tipo_formateado: string;
  clase_tipo: string;
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
  reportesOriginal: ReporteUI[] = [];

  filtroTexto: string = '';
  desde: string = '';
  hasta: string = '';

  private filtroSubject = new Subject<void>();

  showModal = false;
  showExportMenu = false;

  nuevoReporte: Partial<Reporte> = {
    tipo_reporte: '',
    descripcion: '',
    url_documento: ''
  };

  archivoSeleccionado: File | null = null;
  archivoNombre: string = '';

  loading = false;

  toast = {
    visible: false,
    mensaje: '',
    tipo: 'success' as 'success' | 'error' | 'warning'
  };

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.cargarReportes();

    this.filtroSubject
      .pipe(debounceTime(300))
      .subscribe(() => this.filtrar());
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.export-dropdown')) {
      this.showExportMenu = false;
    }
  }

  // 🔥 Toggle con validación PRO
  toggleExportMenu() {
    if (this.reportes.length === 0) {
      this.mostrarToast('No hay reportes para exportar', 'warning');
      return;
    }
    this.showExportMenu = !this.showExportMenu;
  }

  cargarReportes() {
    this.reportsService.getReportes().subscribe({
      next: (data) => {
        const transformados = data.map(r => ({
          ...r,
          tipo_formateado: this.formatearTipo(r.tipo_reporte),
          clase_tipo: this.getClaseTipo(r.tipo_reporte)
        }));

        this.reportesOriginal = transformados;
        this.reportes = [...transformados];
      },
      error: (err) => console.error(err)
    });
  }

  private parseFecha(fecha: string): Date {
    if (!fecha) return new Date(NaN);
    return new Date(fecha);
  }

  onFiltroChange() {
    this.filtroSubject.next();
  }

  onFechaChange() {
    this.filtrar();
  }

  filtrar() {
    this.reportes = this.reportesOriginal.filter(r => {

      const matchTexto =
        !this.filtroTexto ||
        r.tipo_formateado.toLowerCase().includes(this.filtroTexto.toLowerCase());

      const fecha = this.parseFecha(r.fecha_generacion);
      const desde = this.desde ? new Date(this.desde) : null;
      const hasta = this.hasta ? new Date(this.hasta) : null;

      const matchDesde = !desde || fecha >= desde;
      const matchHasta = !hasta || fecha <= hasta;

      return matchTexto && matchDesde && matchHasta;
    });
  }

  exportarExcel() {
    const data = this.reportes.map(r => ({
      Fecha: r.fecha_generacion,
      Tipo: r.tipo_formateado,
      Descripción: r.descripcion,
      Usuario: r.usuario?.nombre || '-',
      Archivo: r.url_documento || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = {
      Sheets: { Reportes: worksheet },
      SheetNames: ['Reportes']
    };

    XLSX.writeFile(workbook, 'reportes.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();

    const columns = ['Fecha', 'Tipo', 'Descripción', 'Usuario', 'Archivo'];

    const rows = this.reportes.map(r => [
      new Date(r.fecha_generacion).toLocaleString(),
      r.tipo_formateado,
      r.descripcion,
      r.usuario?.nombre || '-',
      r.url_documento || '-'
    ]);

    doc.text('Listado de Reportes', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: rows,
    });

    doc.save('reportes.pdf');
  }

  private formatearTipo(tipo: string): string {
    return tipo.replaceAll('_', ' ');
  }

  private getClaseTipo(tipo: string): string {
    switch (tipo) {
      case 'ALTA_ROTACION': return 'badge-warning';
      case 'BAJA_POSTULACION': return 'badge-danger';
      case 'DISPONIBILIDAD_POR_CARGO': return 'badge-success';
      default: return 'badge-default';
    }
  }

  abrirModal() {
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;

    this.nuevoReporte = {
      tipo_reporte: '',
      descripcion: '',
      url_documento: ''
    };

    this.archivoSeleccionado = null;
    this.archivoNombre = '';

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      this.mostrarToast(`El archivo supera los ${maxSizeMB}MB`, 'warning');
      event.target.value = '';
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.mostrarToast('Solo se permiten archivos PDF o Excel', 'warning');
      event.target.value = '';
      return;
    }

    this.archivoSeleccionado = file;
    this.archivoNombre = file.name;
  }

  eliminarArchivo() {
    this.archivoSeleccionado = null;
    this.archivoNombre = '';

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }

  getFileIcon(): string {
    if (!this.archivoNombre) return '';

    if (this.archivoNombre.endsWith('.pdf')) return '📄';
    if (this.archivoNombre.endsWith('.xlsx') || this.archivoNombre.endsWith('.xls')) return '📊';

    return '📁';
  }

  generarReporte() {
    if (!this.nuevoReporte.tipo_reporte) {
      this.mostrarToast('Selecciona un tipo de reporte', 'warning');
      return;
    }

    this.loading = true;

    const usuario = this.getUsuarioActual();

    const reporte: Reporte = {
      tipo_reporte: this.nuevoReporte.tipo_reporte!,
      descripcion: this.nuevoReporte.descripcion || '',
      fecha_generacion: new Date().toISOString(),
      url_documento: this.archivoNombre || '',
      usuario
    };

    this.reportsService.createReporte(reporte).subscribe({
      next: () => {
        this.loading = false;
        this.mostrarToast('Reporte generado correctamente', 'success');
        this.cargarReportes();
        this.cerrarModal();
      },
      error: () => {
        this.loading = false;
        this.mostrarToast('Error al generar el reporte', 'error');
      }
    });
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.toast = { visible: true, mensaje, tipo };

    setTimeout(() => {
      this.toast.visible = false;
    }, 3000);
  }

  private getUsuarioActual() {
    return {
      id: 1,
      nombre: 'Admin Demo'
    };
  }
}