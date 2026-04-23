import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableComponent } from '../table/table';
import { FormsModule } from '@angular/forms';
import { HistorialPostulacionService, HistorialPostulacion } from '@services/historial.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as XLSX from 'xlsx';

type HistorialUI = HistorialPostulacion & {
  selected: boolean;
};

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TableComponent, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class AdminHomeComponent implements OnInit {

  postulantes: HistorialUI[] = [];
  postulantesOriginal: HistorialUI[] = [];

  filtroTexto: string = '';
  desde: string = '';
  hasta: string = '';

  private filtroSubject = new Subject<void>();

  toastVisible = false;
  toastMessage = '';
  toastType: 'error' | 'success' | 'warning' | 'info' = 'info';

  showModal = false;
  modalMessage = '';

  showExportMenu = false;

  constructor(private postulacionService: HistorialPostulacionService) {}

  ngOnInit(): void {
    this.cargarPostulaciones();

    this.filtroSubject
      .pipe(debounceTime(400))
      .subscribe(() => this.filtrar());
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.export-dropdown')) {
      this.showExportMenu = false;
    }
  }

  toggleExportMenu() {
    if (this.cantidadSeleccionados === 0) return;
    this.showExportMenu = !this.showExportMenu;
  }

  cargarPostulaciones() {
    this.postulacionService.getHistorialPostulaciones().subscribe({
      next: (data) => {
        this.postulantesOriginal = data.map(p => ({
          ...p,
          selected: false
        }));

        this.postulantes = [...this.postulantesOriginal];
      },
      error: (err) => console.error(err)
    });
  }

  private parseFecha(fecha: string): Date {
    if (!fecha) return new Date(NaN);
    const [dia, mes, año] = fecha.split('-');
    return new Date(Number(año), Number(mes) - 1, Number(dia));
  }

  getSeleccionados(): HistorialUI[] {
    return this.postulantes.filter(p => p.selected);
  }

  get cantidadSeleccionados() {
    return this.getSeleccionados().length;
  }

  onFiltroChange() {
    this.filtroSubject.next();
  }

  onFechaChange() {
    this.filtrar();
  }

  filtrar() {

    const seleccionadosIds = new Set(
      this.postulantes.filter(p => p.selected).map(p => p.id_postulacion)
    );

    this.postulantes = this.postulantesOriginal.filter(p => {

      const matchTexto =
        !this.filtroTexto ||
        (
          (p.postulante ?? '') + ' ' + (p.cargo ?? '')
        )
        .toLowerCase()
        .includes(this.filtroTexto.toLowerCase());

      const fechaPostulante = this.parseFecha(p.fecha);
      const fechaDesde = this.desde ? new Date(this.desde) : null;
      const fechaHasta = this.hasta ? new Date(this.hasta) : null;

      if (fechaHasta) {
        fechaHasta.setHours(23, 59, 59, 999);
      }

      const matchDesde =
        !fechaDesde || fechaPostulante >= fechaDesde;

      const matchHasta =
        !fechaHasta || fechaPostulante <= fechaHasta;

      return matchTexto && matchDesde && matchHasta;
    });

    this.postulantes.forEach(p => {
      p.selected = seleccionadosIds.has(p.id_postulacion);
    });
  }

  toggleAll(event: any) {
    const checked = event.target.checked;

    this.postulantes.forEach(p => p.selected = checked);

    this.postulantesOriginal.forEach(p => {
      if (this.postulantes.find(x => x.id_postulacion === p.id_postulacion)) {
        p.selected = checked;
      }
    });
  }

  exportarExcel() {
    const seleccionados = this.getSeleccionados();

    if (seleccionados.length === 0) {
      this.showToast('Debes seleccionar al menos una postulación', 'warning');
      return;
    }

    const data = seleccionados.map(p => ({
      Fecha: p.fecha,
      Postulante: p.postulante,
      Cargo: p.cargo,
      Estado: p.estado,
      Resultado: p.resultado
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = {
      Sheets: { Postulaciones: worksheet },
      SheetNames: ['Postulaciones']
    };

    XLSX.writeFile(workbook, 'postulaciones.xlsx');

    this.showToast('Exportación exitosa', 'success');
  }

  depurar() {
    const seleccionados = this.getSeleccionados();

    if (seleccionados.length === 0) {
      this.showToast('Debes seleccionar al menos una postulación', 'warning');
      return;
    }

    this.modalMessage = '¿Estás seguro de eliminar las postulaciones seleccionadas?';
    this.showModal = true;
  }

  confirmarEliminar() {
    const idsEliminar = new Set(
      this.getSeleccionados().map(p => p.id_postulacion)
    );

    this.postulantes = this.postulantes.filter(
      p => !idsEliminar.has(p.id_postulacion)
    );

    this.postulantesOriginal = this.postulantesOriginal.filter(
      p => !idsEliminar.has(p.id_postulacion)
    );

    this.postulantes.forEach(p => p.selected = false);

    this.showModal = false;

    this.showToast('Postulaciones eliminadas con éxito', 'success');
  }

  cancelarEliminar() {
    this.showModal = false;
  }

  showToast(message: string, type: typeof this.toastType = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }
}