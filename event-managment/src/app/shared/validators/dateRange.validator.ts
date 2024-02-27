import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('eventStartDate');
  const endDate = control.get('eventEndDate');

  if (!startDate || !endDate || !startDate.value || !endDate.value) {
    return null; // Don't perform validation if dates are not provided
  }

  const start = new Date(startDate.value);
  const today = new Date();
  const end = new Date(endDate.value);

  if (start > end) {
    return { dateRange: 'End date must be greater or equal than start date' };
  }

  // Validate if the selected start date is today or later
  if (start.toISOString().split('T')[0] <= today.toISOString().split('T')[0]) {
    return { dateRange: 'Start date must be later than today' };
  }

  return null;
};
