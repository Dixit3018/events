 import { Injectable } from '@angular/core';
 import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class AlertService {

    showAlert(title: string, text: string, icon: SweetAlertIcon, confirmButtonColor: string) {
        Swal.fire({
          title: title,
          text: text,
          icon: icon,
          confirmButtonColor: confirmButtonColor,
          confirmButtonText: 'Proceed!'
        });
      }
}