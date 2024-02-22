import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// Custom validator function
export function notSelectedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === 'select-city' || value === 'select-state') {
      return { notSelected: true }; // Validation error
    }

    return null;
  };
}
