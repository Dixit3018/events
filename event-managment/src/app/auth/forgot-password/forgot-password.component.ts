import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AlertService } from '../../services/alert.service';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPass: FormGroup;
  clickOnce: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _http: HttpService,
    private alertService: AlertService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.forgotPass = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.clickOnce = false;
    const email = this.forgotPass.value.email;

    this._http.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.alertService.showAlert(
          'Sent!',
          'We have sent you link on email!',
          'success',
          'green'
        );

        this.forgotPass.reset();
        localStorage.setItem('reset-password-token', JSON.stringify(this.cryptoService.encrypt(res.token)));
        localStorage.setItem('userId', JSON.stringify(res.userId));
      },
      error: (error) => {
        if (error.status === 404) {
        this.alertService.showAlert('Oops!','User not exists!','error','green')

          this.forgotPass.reset();
        }
      },
    });
  }
}
