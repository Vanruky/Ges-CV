import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class TableComponent {

  @Input() data: any[] = [];
  @Input() tipo: 'historial' | 'reportes' = 'historial';

  @Input() selectedIds: number[] = [];

  @Output() toggleSelection = new EventEmitter<number>();

  @Output() openPdfEvent = new EventEmitter<string>();

  openPdf(url: string) {
    this.openPdfEvent.emit(url);
  }

}