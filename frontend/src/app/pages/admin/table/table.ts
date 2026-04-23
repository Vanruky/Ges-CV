import { Component, Input } from '@angular/core';
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

}
