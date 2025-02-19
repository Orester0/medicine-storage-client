import { CommonModule } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { passwordMatchValidator } from '../../_validators/validators';
import { ValidationErrorsComponent } from '../../validation-errors/validation-errors.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorsComponent],
  templateUrl: './register.component.html',
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;


  validationErrors: string[] = [];
  roles = ['doctor', 'distributor'];
  isLoading = false;
  
  cancelRegister = output<boolean>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
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
      role: ['', [Validators.required]],
    }, 
    { 
      validators: [passwordMatchValidator]
    }
  );
  }


  private handleValidationErrors(error: unknown): void {
    if (typeof error === 'object' && error !== null) {
      const err = error as any;
      
      if (err.error?.errors) {
        if (Array.isArray(err.error.errors)) {
          this.validationErrors = err.error.errors;
        } else {
          this.validationErrors = Object.values(err.error.errors as Record<string, string[]>)
            .flat()
            .map((errMsg: unknown) => String(errMsg));
        }
      } else if (err.error?.title && err.error?.errors) {
        const errorMessages = Object.values(err.error.errors as Record<string, string[]>)
          .flat()
          .map((errMsg: unknown) => String(errMsg));
        this.validationErrors = [`${err.error.title}: ${errorMessages.join(', ')}`];
      } else {
        this.validationErrors = ['An unexpected error occurred'];
      }
    } else {
      this.validationErrors = ['An unexpected error occurred'];
    }
  }

  register(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formData = {
        ...this.registerForm.value,
        roles: [this.registerForm.value.role],
      };

      this.authService.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/medicines']);
        },
        error: (error) => {
          this.handleValidationErrors(error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  cancel(): void {
    this.cancelRegister.emit(false);
    this.router.navigate(['/']);
  }
}
