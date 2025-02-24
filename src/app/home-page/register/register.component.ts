import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { passwordMatchValidator } from '../../_validators/validators';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent, MatIconModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancelClick = new EventEmitter<void>();

  userForm!: FormGroup;
  validationErrors: string[] = [];
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  get showPositionField(): boolean {
    return !this.userForm.get('roleType')?.value;
  }

  get showCompanyField(): boolean {
    return this.userForm.get('roleType')?.value;
  }

  private initializeForm(): void {
    this.userForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
        ]],
        confirmPassword: ['', [Validators.required]],
        roleType: [false], 
        position: [''],
        company: ['']
      },
      { validators: [passwordMatchValidator] }
    );

    this.userForm.get('roleType')?.valueChanges.subscribe(this.handleRoleTypeChange.bind(this));
  }

  private handleRoleTypeChange(isDistributor: boolean): void {
    const positionControl = this.userForm.get('position');
    const companyControl = this.userForm.get('company');

    if (isDistributor) {
      positionControl?.setValue('');
      positionControl?.clearValidators();
      companyControl?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
    } else {
      companyControl?.setValue('');
      companyControl?.clearValidators();
      positionControl?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
    }

    positionControl?.updateValueAndValidity();
    companyControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isLoading) {
      const formData = {
        ...this.userForm.value,
        role: this.userForm.value.roleType ? 'distributor' : 'doctor',
        position: this.showPositionField ? this.userForm.value.position : null,
        company: this.showCompanyField ? this.userForm.value.company : null
      };

      this.formSubmit.emit(formData);
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    this.userForm.reset();
    this.cancelClick.emit();
  }
}
