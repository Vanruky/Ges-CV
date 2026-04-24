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

  filtroTexto = '';
  desde = '';
  hasta = '';

  private filtroSubject = new Subject<void>();

  showModal = false;
  showExportMenu = false;

  nuevoReporte: Partial<Reporte> = {
    tipo_reporte: '',
    descripcion: '',
    url_documento: ''
  };

  archivoSeleccionado: File | null = null;
  archivoNombre = '';

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

  cargarReportes() {
    this.loading = true;

    this.reportsService.getReportes().subscribe({
      next: (data) => {

        const transformados: ReporteUI[] = data.map(r => ({
          ...r,
          tipo_formateado: this.formatearTipo(r.tipo_reporte),
          clase_tipo: this.getClaseTipo(r.tipo_reporte)
        }));

        this.reportesOriginal = transformados;
        this.reportes = [...transformados];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.mostrarToast('Error al cargar reportes', 'error');
      }
    });
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
        (r.tipo_formateado ?? '')
          .toLowerCase()
          .includes(this.filtroTexto.toLowerCase());

      const fecha = r.fecha_generacion ? new Date(r.fecha_generacion) : null;
      const desde = this.desde ? new Date(this.desde) : null;
      const hasta = this.hasta ? new Date(this.hasta) : null;

      const matchDesde = !desde || (fecha && fecha >= desde);
      const matchHasta = !hasta || (fecha && fecha <= hasta);

      return matchTexto && matchDesde && matchHasta;
    });
  }

  exportarExcel() {
    const data = this.reportes.map(r => ({
      Fecha: r.fecha_generacion,
      Tipo: r.tipo_formateado,
      Descripción: r.descripcion,
      Usuario: r.usuario?.correo ?? 'Sin usuario',
      Archivo: r.url_documento ?? '-'
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
      r.usuario?.correo ?? 'Sin usuario',
      r.url_documento ?? '-'
    ]);

    doc.text('Listado de Reportes', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: rows,
    });

    doc.save('reportes.pdf');
  }

  generarReporte() {

    if (!this.nuevoReporte.tipo_reporte) {
      this.mostrarToast('Debes seleccionar un tipo de reporte', 'warning');
      return;
    }

    this.loading = true;

    const formData = new FormData();

    const userId = Number(localStorage.getItem('user_id'));

    formData.append('id_usuario', String(userId));
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
      descripcion: '',
      url_documento: ''
    };

    this.archivoSeleccionado = null;
    this.archivoNombre = '';
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.toast = { visible: true, mensaje, tipo };

    setTimeout(() => {
      this.toast.visible = false;
    }, 3000);
  }


  private formatearTipo(tipo: string): string {
    return tipo?.replaceAll('_', ' ') ?? '';
  }

  private getClaseTipo(tipo: string): string {
    switch (tipo) {
      case 'ALTA_ROTACION': return 'badge-warning';
      case 'BAJA_POSTULACION': return 'badge-danger';
      case 'DISPONIBILIDAD_POR_CARGO': return 'badge-success';
      default: return 'badge-default';
    }
  }
}