import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (value: any, row: T) => string | number | boolean;
  sortable?: boolean;
}

export interface TableAction<T> {
  label: string;
  class?: string;
  onClick: (row: T) => void;
  visible?: (row: T) => boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() actions?: TableAction<T>[];
  @Output() sort = new EventEmitter<{ key: keyof T; isDescending: boolean }>();

  sortConfig: { key: keyof T; isDescending: boolean } | null = null;

  handleSort(key: keyof T | 'actions'): void {
    if (key === 'actions') return;

    const isDescending = this.sortConfig?.key === key ? !this.sortConfig.isDescending : false;
    this.sortConfig = { key, isDescending };
    this.sort.emit(this.sortConfig);
  }
}
