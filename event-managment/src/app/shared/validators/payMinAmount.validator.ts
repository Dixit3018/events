import { AbstractControl } from '@angular/forms';

export function minAmountValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;

  if (value >= 100) {
    return null; // Validation passed
  } else {
    return { 'minAmount': true }; // Validation failed
  }
}