 import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class AlertService {

  constructor(private router:Router) {}

  showAlert(title: string, text: string, icon: SweetAlertIcon, confirmButtonColor: string) {
        Swal.fire({
          title: title,
          text: text,
          icon: icon,
          confirmButtonColor: confirmButtonColor,
          confirmButtonText: 'Proceed!',
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `,
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `,
          },
        });
      }
      
    showAlertRedirect(title:string,text:string,icon:SweetAlertIcon,confirmBtnColor:string,route:string) {
                  Swal.fire({
              title: title,
              text: text,
              icon: icon,
              showCancelButton: false,
              confirmButtonColor: confirmBtnColor,
              confirmButtonText: 'Proceed!',
              willClose: (dismiss: any) => {
                this.router.navigate([route]);
              },
              showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `,
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
              },
            });
    }
}