import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const organizerGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');

  if (user) {
    if (JSON.parse(user).role === 'organizer') {
      return true;
    } else {
      inject(Router).navigate(['/dashboard']);
      return false;
    }
  } else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
