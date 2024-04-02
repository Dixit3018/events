import { AbstractControl } from '@angular/forms';

export function ageRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const age = control.value;
  if (age === null || age === undefined || age < 0 || age > 60 || age < 16) {
    return { 'invalidAge': true };
  }
  return null;
}
