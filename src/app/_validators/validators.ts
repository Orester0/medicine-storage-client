import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  
  const date = new Date(control.value);
  return isNaN(date.getTime()) ? { invalidDate: true } : null;
};export const pastDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const date = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today ? { pastDate: true } : null;
};

export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const date = new Date(control.value);
  const today = new Date();
  return date > today ? { futureDate: true } : null;
};

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;
  
  return password === confirmPassword ? null : { mismatch: true };
};

export function uniqueValidator(existingValues: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return existingValues.includes(control.value) ? { unique: true } : null;
  };
}
