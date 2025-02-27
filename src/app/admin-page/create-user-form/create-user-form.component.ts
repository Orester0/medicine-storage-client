import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-user-form',
  imports: [ValidationErrorsComponent, CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.css'
})
export class CreateUserFormComponent {
  private fb = inject(FormBuilder);
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancelClick = new EventEmitter<void>();

  userForm!: FormGroup;
  availableRoles = ['doctor', 'distributor', 'admin', 'manager'];
  isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  get showPositionField(): boolean {
    return this.userForm.get('roles')?.value.includes('doctor');
  }

  get showCompanyField(): boolean {
    return this.userForm.get('roles')?.value.includes('distributor');
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
      ]],
      roles: [[], Validators.required],
      position: [''],
      company: ['']
    });

    this.userForm.get('roles')?.valueChanges.subscribe(this.handleRolesChange.bind(this));
  }

  private handleRolesChange(roles: string[]): void {
    const positionControl = this.userForm.get('position');
    const companyControl = this.userForm.get('company');

    if (roles.includes('distributor')) {
      companyControl?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
    } else {
      companyControl?.clearValidators();
      companyControl?.setValue('');
    }

    if (roles.includes('doctor')) {
      positionControl?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
    } else {
      positionControl?.clearValidators();
      positionControl?.setValue('');
    }

    positionControl?.updateValueAndValidity();
    companyControl?.updateValueAndValidity();
  }

  toggleRole(role: string): void {
    const control = this.userForm.get('roles');
    let roles = [...(control?.value || [])];

    if (roles.includes(role)) {
      roles = roles.filter(r => r !== role);
    } else {
      roles.push(role);
    }

    control?.setValue(roles);
    control?.updateValueAndValidity();
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'doctor': return 'medical_services';
      case 'distributor': return 'local_shipping';
      case 'admin': return 'admin_panel_settings';
      case 'moderator': return 'supervisor_account';
      default: return 'person';
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formData = {
        ...this.userForm.value,
        position: this.showPositionField ? this.userForm.value.position : null,
        company: this.showCompanyField ? this.userForm.value.company : null
      };

      this.formSubmit.emit(formData);
      this.isLoading = false;
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
    this.cancelClick.emit();
  }
}
