import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HostListener } from '@angular/core';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { value: any; label: string }[];
  col?: number;
  defaultValue?: any;
  multiselect?: boolean;
  isOpen?: boolean;
  value?: any;
}


@Component({
  selector: 'app-filter',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatCheckboxModule],
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
  private fb = inject(FormBuilder);

  @Input() config: FilterConfig[] = [];
  @Input() title = 'Filters';
  @Output() filterChange = new EventEmitter<any>();

  form!: FormGroup;
  isVisible = false;

  constructor() {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.initializeForm();
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    const group: Record<string, any> = {};
    this.config.forEach(field => {
      group[field.key] = [field.defaultValue ?? null];
      field.isOpen = false;
    });
    this.form = this.fb.group(group);
  }
  

  toggleFilters(): void {
    this.isVisible = !this.isVisible;
  }

  toggleSelect(field: FilterConfig): void {
    field.isOpen = !field.isOpen;
    // Close other select dropdowns
    this.config.forEach(f => {
      if (f !== field) f.isOpen = false;
    });
  }

  hasSelectedValues(field: FilterConfig): boolean {
    const value = this.form.get(field.key)?.value;
    if (field.multiselect) {
      return value && Array.isArray(value) && value.length > 0;
    }
    return value !== null && value !== undefined;
  }

  selectOption(field: FilterConfig, value: any): void {
    const control = this.form.get(field.key);
    if (!control) return;

    if (field.multiselect) {
      const currentValues = control.value || [];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        control.setValue([...currentValues, value]);
      } else {
        currentValues.splice(index, 1);
        control.setValue([...currentValues]);
      }
    } else {
      control.setValue(value);
      field.isOpen = false;
    }
  }

  isOptionSelected(field: FilterConfig, value: any): boolean {
    const currentValue = this.form.get(field.key)?.value;
    if (!currentValue) return false;
    
    if (field.multiselect) {
      return Array.isArray(currentValue) && currentValue.includes(value);
    }
    return currentValue === value;
  }

  getSelectedLabel(field: FilterConfig): string {
    const value = this.form.get(field.key)?.value;
    
    if (field.multiselect) {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return field.label;
      }
      
      if (value.length === 1) {
        const selectedOption = field.options?.find(opt => opt.value === value[0]);
        return selectedOption ? selectedOption.label : field.label;
      }
      
      return `${value.length} selected`;
    } else {
      if (!value) return 'All';
      const selectedOption = field.options?.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : 'All';
    }
  }

  resetFilters(): void {
    this.form.reset();
    this.config.forEach(field => {
      this.form.get(field.key)?.setValue(field.defaultValue);
    });
    this.filterChange.emit(this.form.value);
  }

  applyFilters(): void {
    this.filterChange.emit(this.form.value);
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      this.config.forEach(field => field.isOpen = false);
    }
  }
}