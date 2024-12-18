import { Component, OnInit, output, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './register.component.html',
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  validationErrors: string[] = [];
  roles = ['member', 'distributor'];
  
  cancelRegister = output<boolean>();

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const formData = {
        ...this.registerForm.value,
        roles: [this.registerForm.value.role], 
      };

      this.accountService.register(formData).subscribe({
        next: (user) => {
          console.log('Registration successful:', user);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.validationErrors = error?.error?.errors || ['Registration failed.'];
        },
      });
    }
  }

  cancel(){
    console.log('Registration canceled');
    this.cancelRegister.emit(false);
  }
}
