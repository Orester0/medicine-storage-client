import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { value: any; label: string }[];
  col?: number;
}

@Component({
  selector: 'app-filter',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() config: FilterConfig[] = [];
  @Input() title = 'Filters';
  @Output() filterChange = new EventEmitter<any>();

  form!: FormGroup;
  isVisible = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.initForm();
    }
  }

  private initForm(): void {
    const group: Record<string, any> = {};
    this.config.forEach(field => {
      group[field.key] = [null];
    });
    this.form = this.fb.group(group);
  }

  toggleFilters(): void {
    this.isVisible = !this.isVisible;
  }

  resetFilters(): void {
    this.form.reset();
    this.filterChange.emit(this.form.value);
  }

  applyFilters(): void {
    this.filterChange.emit(this.form.value);
  }
}