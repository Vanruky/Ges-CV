import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../table/table';
import { HistorialPostulacionService, HistorialPostulacion } from '@services/historial.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class AdminHomeComponent implements OnInit {

  postulantes: HistorialPostulacion[] = [];

  selectedIds = new Set<number>();
  selectAllChecked = false;

  filtroTexto = '';
  desde = '';
  hasta = '';

  loading = false;

  showModal = false;
  modalMessage = '';
  showExportMenu = false;

  submenu: 'selected' | 'filtered' | null = null;

  toastVisible = false;
  toastMessage = '';
  toastType: 'error' | 'success' | 'warning' | 'info' = 'info';

  private filtroSubject = new Subject<void>();

  constructor(private service: HistorialPostulacionService) {}

  ngOnInit(): void {
    this.cargar();

    this.filtroSubject
      .pipe(debounceTime(400))
      .subscribe(() => this.cargar());
  }

  private getFiltros() {
    return {
      texto: this.filtroTexto || undefined,
      desde: this.desde || undefined,
      hasta: this.hasta || undefined
    };
  }

  cargar() {
    this.loading = true;

    this.service.getHistorialPostulaciones(this.getFiltros())
      .subscribe({
        next: (data) => {
          this.postulantes = data;
          this.selectedIds.clear();
          this.selectAllChecked = false;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.showToast('Error al cargar datos', 'error');
        }
      });
  }

  onFiltroChange() {
    this.filtroSubject.next();
  }

  onFechaChange() {
    this.cargar();
  }

  toggleSelection(id: number) {
    this.selectedIds.has(id)
      ? this.selectedIds.delete(id)
      : this.selectedIds.add(id);

    this.syncSelectAllState();
  }

  toggleSelectAll() {
    this.selectAllChecked = !this.selectAllChecked;

    this.selectedIds = this.selectAllChecked
      ? new Set(this.postulantes.map(p => p.id_postulacion))
      : new Set();

    this.syncSelectAllState();
  }

  syncSelectAllState() {
    this.selectAllChecked =
      this.postulantes.length > 0 &&
      this.selectedIds.size === this.postulantes.length;
  }

  get cantidadSeleccionados() {
    return this.selectedIds.size;
  }

  get cantidadFiltrados() {
    return this.postulantes.length;
  }

  toggleSubmenu(menu: 'selected' | 'filtered') {
    this.submenu = this.submenu === menu ? null : menu;
  }

  exportar(tipo: 'pdf' | 'excel', modo: 'selected' | 'filtered') {

    const filtros = this.getFiltros();
    const ids = Array.from(this.selectedIds);

    if (tipo === 'pdf') {
      if (modo === 'selected') {
        if (!ids.length) return;

        this.service.exportPDF({}, ids)
          .subscribe(blob => this.download(blob, 'postulaciones-seleccionadas.pdf'));

      } else {
        this.service.exportPDF(filtros)
          .subscribe(blob => this.download(blob, 'postulaciones-filtradas.pdf'));
      }
    }

    if (tipo === 'excel') {
      if (modo === 'selected') {
        if (!ids.length) return;

        this.service.exportExcel({}, ids)
          .subscribe(blob => this.download(blob, 'postulaciones-seleccionadas.xlsx'));

      } else {
        this.service.exportExcel(filtros)
          .subscribe(blob => this.download(blob, 'postulaciones-filtradas.xlsx'));
      }
    }

    this.showExportMenu = false;
    this.submenu = null;
  }

  private download(blob: Blob, name: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  depurar() {
    if (!this.selectedIds.size) return;

    this.modalMessage = `¿Eliminar ${this.selectedIds.size} postulaciones?`;
    this.showModal = true;
  }

  confirmarEliminar() {
    const ids = Array.from(this.selectedIds);

    if (ids.length === this.postulantes.length) {
      this.showToast('No puedes eliminar todos los registros', 'warning');
      this.showModal = false;
      return;
    }

    const MAX_DELETE = 50;
    if (ids.length > MAX_DELETE) {
      this.showToast(`Solo puedes eliminar hasta ${MAX_DELETE} registros`, 'warning');
      this.showModal = false;
      return;
    }

    this.service.deletePostulaciones(ids).subscribe({
      next: () => {
        this.selectedIds.clear();
        this.selectAllChecked = false;
        this.showModal = false;
        this.cargar();
        this.showToast('Eliminado correctamente', 'success');
      },
      error: () => this.showToast('Error al eliminar', 'error')
    });
  }

  cancelarEliminar() {
    this.showModal = false;
  }

  toggleExportMenu() {
    if (!this.postulantes.length) return;

    this.showExportMenu = !this.showExportMenu;
    this.submenu = null; 
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.export-dropdown')) {
      this.showExportMenu = false;
      this.submenu = null; 
    }
  }

  showToast(message: string, type: 'error' | 'success' | 'warning' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => this.toastVisible = false, 3000);
  }

}