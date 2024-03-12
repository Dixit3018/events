import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { SocketService } from '../../services/socket.service';

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

  constructor(
    private _auth: AuthService,
    private router: Router,
    private http: HttpService,
    private socket: SocketService
  ) {}

  ngOnInit(): void {
    this._auth.user.subscribe((user) => {
      if (!!user) {
        this.loggedIn = true;
        this.userRole = user.role;
        this.getUserImg();
      } else {
        this.loggedIn = false;
      }
    });

    const userStored = localStorage.getItem('user');
    
    if (!!userStored) {
      const userData = JSON.parse(userStored);
      this.userId = userData['_id'];
      
      this.loggedIn = true;
      this._auth.user.next(userData);
      this.userRole = userData.role;
    }
    this.getUserImg()

    this._auth.userProfileImg.subscribe(newImgPath => {
      this.getUserImg();
    })
  }
  
  getUserImg() {
    const storedImg = sessionStorage.getItem('profileImg')
    
    if(!!storedImg){
      this.userImg = storedImg;
    }
    else{
      this.getProfileImg();
    } 
  }

  onLogout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('profileImg');
    this._auth.user.next(null);
    this.router.navigate(['/login']);
  }

  getProfileImg() {
    if (this.loggedIn) {
      this.http
        .getUserProfileImg()
        .subscribe((response: { image?: string }) => {

          if(response.image){

            sessionStorage.setItem('profileImg',`data:image/png;base64,${response.image}`)
            this.userImg = `data:image/png;base64,${response.image}`;
          }
          else{
            sessionStorage.setItem('profileImg',`/assets/images/profile/default-profile.png`)
            this.userImg = `/assets/images/profile/default-profile.png`;
          }
        },
        error => {
          this.userImg = '/assets/images/profile/default-profile.png';
          console.log(error);
        });
      }
  }
}
