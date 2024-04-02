import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('eventStartDate');
  const endDate = control.get('eventEndDate');

  if (!startDate || !endDate || !startDate.value || !endDate.value) {
    return null;  
  }

  const start = new Date(startDate.value);
  const today = new Date();
  const end = new Date(endDate.value);

  // Validate the realistic date
  const maxAllowedYear = today.getFullYear() + 1;
  if (start.getFullYear() > maxAllowedYear || end.getFullYear() > maxAllowedYear) {
    return { dateRange: 'You can register events upto upcoming year' };
  }

  // Validate if the date is invalid format
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { dateRange: 'Invalid date format' };
  }

  if (start > end) {
    return { dateRange: 'End date must be greater or equal than start date' };
  }

  // Validate if the selected start date is today or later
  if (start.toISOString().split('T')[0] <= today.toISOString().split('T')[0]) {
    return { dateRange: 'Start date must be later than today' };
  }

  // Validate if the difference between start and end dates is within one year
  const oneYearLater = new Date(start);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  if (end > oneYearLater) {
    return { dateRange: 'Event duration should not exceed one year' };
  }

  return null;
};
