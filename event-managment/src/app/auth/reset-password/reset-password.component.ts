import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2';
import { random } from 'lodash-es';

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
    private _http: HttpService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.token = params.get('token');
    });

    const data = { id: this.id, token: this.token };

    this._http.verifyPasswordResetToken(data).subscribe((data:any) => {
      console.log(data);
      
      if(data.verify === true) {
        this.token = data.token;
      }
      else if(data.verify === false){
        Swal.fire({
          title: 'Expired!',
          text: 'The link is expired please try again!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: 'green',
          confirmButtonText: 'OK',
          willClose: () => {
            this.router.navigate(['/login'])
          }
        });      
      }
    })

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
    const password = this.resetPass.value.password;
    this._http.resetPassword(this.id,password).subscribe((res:any) => {
      
      if(res.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Password reset successfully!',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: 'green',
          confirmButtonText: 'OK',
          willClose: (dismiss:any) => {
              this.router.navigate(['/login']);
          },
        });
      }
      
    }, (error) => {
      if(error.status === 401){
        Swal.fire({
          title: 'Expired!',
          text: 'Link is expired try again!',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: 'green',
          confirmButtonText: 'OK',
          willClose: (dismiss:any) => {
            this.router.navigate(['/login']);
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
