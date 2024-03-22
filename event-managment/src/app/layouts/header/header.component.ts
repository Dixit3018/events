import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;
  userId: string = '';
  userImg: string = '/assets/images/profile/default-profile.png';
  userRole: string;

  constructor(private _auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this._auth.user.subscribe((user) => {
      if (!!user) {
        this.userImg = user.profilePicture;
        this.loggedIn = true;
        this.userRole = user.role;
      } else {
        this.loggedIn = false;
      }
    });
    this.autoLogin();
  }

  onLogout() {
    this._auth.endTracking(this.userId);
    this._auth.user.next(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    sessionStorage.removeItem('profileImg');

    this.router.navigate(['/login']);
  }

  autoLogin() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiry');

    if (token && expiresIn) {
      const expirationTime = parseInt(expiresIn);
      const currentTime = new Date().getTime();

      if (expirationTime > currentTime) {
        const timeoutDuration = expirationTime - currentTime;

        setTimeout(() => {
          this.onLogout();
        }, timeoutDuration);
      } else {
        this.onLogout();
      }
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!!user) {
      this._auth.user.next(user);
    }
  }
}
