import { AbstractControl } from '@angular/forms';

export function limitNumberValidator(min: number, max: number) {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (isNaN(value) || value < min || value > max) {
      return { 'limitNumber': true };
    }
    return null;
  };
}
