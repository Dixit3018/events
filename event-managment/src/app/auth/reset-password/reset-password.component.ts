import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { HttpService } from '../../services/http.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  id: string;
  token: string;
  resetPass: FormGroup;
  passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=<>?]).*$/;

  passwordValidations = [
    { title: 'required', message: 'Required' },
    {
      title: 'pattern',
      message: 'One upper case , one lower case and one digit',
    },
    { title: 'minlength', message: 'Minimum 8 digits' },
    { title: 'maxlength', message: 'Maximum 20 digits' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alertService: AlertService,
    private _http: HttpService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.token = params.get('token');
    });

    this.resetPass = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(this.passwordPattern),
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        cpassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  onSubmit() {
    console.log('Submitted');

    const password = this.resetPass.value.password;
    const data = { id: this.id, token: this.token };

    this._http.verifyPasswordResetToken(data).subscribe({
      next: (data: any) => {
        if (data.verify == true) {
          this.token = data.token;
          this._http.resetPassword(this.id, password).subscribe({
            next: (res: any) => {
              console.log(res);

              if (res.success) {
                this.alertService.showAlertRedirect(
                  'Successs!',
                  'Password reset successfully!',
                  'success',
                  'green',
                  '/login'
                );
              }
            },
            error: (error) => {
              if (error.status === 401) {
                this.alertService.showAlertRedirect(
                  'Expired!',
                  'Link is expired try again!',
                  'error',
                  'green',
                  '/login'
                );
              }
            },
          });
        } else if (data.verify == false) {
          this.alertService.showAlertRedirect(
            'Expired!',
            'The link is expired please try again!',
            'error',
            'green',
            '/login'
          );
        }
      },
      error: (error) =>
        this.alertService.showAlertRedirect(
          'Expired',
          'Invalid token',
          'error',
          'green',
          '/login'
        ),
    });
  }

  get confirmPassword() {
    return this.resetPass.get('cpassword');
  }

  getValidationImagePath(validate: string): string {
    if (
      this.resetPass.get('password').value === '' ||
      this.resetPass.get('password').value === null
    ) {
      return '/assets/icons/cross.png';
    }
    return this.resetPass.get('password').hasError(validate)
      ? '/assets/icons/cross.png'
      : '/assets/icons/correct.png';
  }
}
