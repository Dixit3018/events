import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2';

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
    this.route.paramMap.subscribe((params: any) => {
      this.id = params.id;
      this.token = params.token;
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
    const password = this.resetPass.value.password;
    this._http.resetPassword(password).subscribe((res:any) => {
      
      if(res.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
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
