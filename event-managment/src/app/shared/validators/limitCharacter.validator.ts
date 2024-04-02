import { AbstractControl } from '@angular/forms';

export function limitCharacterValidator(limit: number) {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const characters = control.value;
    if (characters && characters.length > limit) {
      return { 'exceedsLimit': true };
    }
    return null;
  };
}
