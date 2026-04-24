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

  cargar() {
    this.loading = true;

    this.service.getHistorialPostulaciones({
      nombre: this.filtroTexto,
      desde: this.desde,
      hasta: this.hasta
    }).subscribe({
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
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }

    this.syncSelectAllState();
  }

  toggleSelectAll() {
    this.selectAllChecked = !this.selectAllChecked;

    if (this.selectAllChecked) {
      this.selectedIds = new Set(this.postulantes.map(p => p.id_postulacion));
    } else {
      this.selectedIds.clear();
    }
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


  setExportMode(mode: 'selected' | 'filtered') {

    if (mode === 'selected') {
      this.exportSeleccionados();
    } else {
      this.exportFiltrados();
    }

    this.showExportMenu = false;
  }

  exportSeleccionados() {
    const ids = Array.from(this.selectedIds);
    if (!ids.length) return;

    this.service.exportPDF({ ids }).subscribe(blob => {
      this.download(blob, 'postulaciones-seleccionadas.pdf');
    });
  }

  exportFiltrados() {
    this.service.exportPDF({
      nombre: this.filtroTexto,
      desde: this.desde,
      hasta: this.hasta
    }).subscribe(blob => {
      this.download(blob, 'postulaciones-filtradas.pdf');
    });
  }

  exportExcel() {
    this.service.exportExcel({
      nombre: this.filtroTexto,
      desde: this.desde,
      hasta: this.hasta
    }).subscribe(blob => {
      this.download(blob, 'postulaciones.xlsx');
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

  depurar() {
    if (!this.selectedIds.size) return;

    this.modalMessage = `¿Eliminar ${this.selectedIds.size} postulaciones?`;
    this.showModal = true;
  }

  confirmarEliminar() {
    const ids = Array.from(this.selectedIds);

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
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.export-dropdown')) {
      this.showExportMenu = false;
    }
  }

  showToast(message: string, type: any = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => this.toastVisible = false, 3000);
  }
}