import { AbstractControl } from '@angular/forms';

export function atLeastOneValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;

  if (value >= 1) {
    return null; // Validation passed
  } else {
    return { 'atLeastOne': true }; // Validation failed
  }
}