import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('cpassword');

  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    // Don't perform validation if passwords are not provided
    return null;
  }

  if (password.value !== confirmPassword.value) {
    return { passwordMatch: true }; // Passwords don't match
  }

  return null; // Passwords match
};
