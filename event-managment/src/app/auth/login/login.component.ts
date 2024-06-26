import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { CryptoService } from '../../services/crypto.service';

export interface LoginData {
  message: string;
  user: User;
  status: string;
  token: string;
  expiresIn: string;
}

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
    private router: Router,
    private alertService: AlertService,
    private cryptoService: CryptoService
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
      .subscribe({
        next: (data: LoginData) => {
          if (data.user && data.token) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem(
              'token',
              this.cryptoService.encrypt(JSON.stringify(data.token))
            );
            localStorage.setItem('expiry', JSON.stringify(data.expiresIn));

            this._auth.user.next(data.user);

            this._auth.startTracking();
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.log(error);
          
          this.alertService.showAlert(
            'Error',
            'Invalid Credentials',
            'error',
            'Try Again'
          );
        },
      });
  }
}
