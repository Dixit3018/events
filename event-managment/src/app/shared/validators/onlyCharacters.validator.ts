import { AbstractControl } from '@angular/forms';

export function noNumbersValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value: string = control.value;
  if (value && /\d/.test(value)) {
    return { 'containsNumbers': true };
  }
  return null;
}
