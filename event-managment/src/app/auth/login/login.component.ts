import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['volunteer', Validators.required],
    });
  }

  onLogin() {
    const loginData = this.loginForm.value;
    this._auth
      .login(loginData.email, loginData.password, loginData.role)
      .subscribe(
        (data: { message: string; user: any }) => {
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            this._auth.user.next(data.user);
            this._auth.startTracking();
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Invalid Credentials',
            icon: 'error',
            confirmButtonColor: 'green',
            confirmButtonText: 'Proceed!',
          });
        }
      );
  }
}
