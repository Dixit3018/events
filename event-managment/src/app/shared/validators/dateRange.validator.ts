import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('eventStartDate');
  const endDate = control.get('eventEndDate');

  if (!startDate || !endDate || !startDate.value || !endDate.value) {
    return null; // Don't perform validation if dates are not provided
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (start > end) {
    return { dateRange: 'End date must be greater than start date' };
  }

  return null;
};
