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
  @Input() selectedIds: Set<number> = new Set<number>();
  @Output() toggleSelection = new EventEmitter<number>();

}
