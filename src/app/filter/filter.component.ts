import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { value: any; label: string }[];
  col?: number;
  defaultValue?: any;
}


@Component({
  selector: 'app-filter',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px)',
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)',
      })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
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
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.initForm();
    }
  }

  private initForm(): void {
    const group: Record<string, any> = {};
    this.config.forEach(field => {
      group[field.key] = [field.defaultValue ?? null];
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