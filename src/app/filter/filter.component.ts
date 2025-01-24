import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: { label: string; value: any }[];
}

@Component({
  selector: 'app-filter',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() fields: FilterField[] = [];
  @Output() filterChange = new EventEmitter<Record<string, any>>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const group: Record<string, any> = {};
    this.fields.forEach((field) => {
      group[field.name] = [''];
    });
    this.form = this.fb.group(group);

    this.form.valueChanges.subscribe((value) => {
      this.filterChange.emit(value);
    });
  }
}