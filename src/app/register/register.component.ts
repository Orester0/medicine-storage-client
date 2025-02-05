import { Component, OnInit, output, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
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

      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/login'], { queryParams: { registered: true } });
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
