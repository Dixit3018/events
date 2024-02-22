import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const homeGuard: CanActivateFn = (route, state) => {
  
  if(localStorage.getItem('user') === null){
    return true;
  }
  else{
    inject(Router).navigate(['/dashboard']);
    return false;
  }
};
