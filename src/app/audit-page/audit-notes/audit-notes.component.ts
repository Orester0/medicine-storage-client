import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-notes',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './audit-notes.component.html',
  styleUrl: './audit-notes.component.css'
})
export class AuditNotesComponent implements OnInit {
  @Input() title!: string;
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const formGroup: any = {
      note: ['', [Validators.maxLength(500), Validators.minLength(5)]]
    };
    this.form = this.fb.group(formGroup);
  }

  onSubmit() {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.form.valid) {
      const result: any = {
        note: this.form.get('note')?.value
      };
      this.submit.emit(result);
    }
  }
}
