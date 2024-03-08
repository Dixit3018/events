import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPass: FormGroup;
  clickOnce: boolean = true;

  constructor(private fb: FormBuilder, private _http: HttpService) {}

  ngOnInit(): void {
    this.forgotPass = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.clickOnce = false;
    const email = this.forgotPass.value.email;

    this._http.forgotPassword(email).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Sent!',
          text: 'We have sent you link on email!',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: 'green',
          confirmButtonText: 'OK',
        });
        this.forgotPass.reset();
        localStorage.setItem('token', JSON.stringify(res.token));
        localStorage.setItem('userId', JSON.stringify(res.userId));
      },
      (error) => {
        if (error.status === 404) {
          Swal.fire({
            title: 'Oops!',
            text: 'User not exists!',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: 'green',
            confirmButtonText: 'OK',
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
          this.forgotPass.reset();
        }
      }
    );
  }
}
