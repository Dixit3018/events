import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userData: User;
  img: string;
  isEditMode: boolean = false;


  constructor(private _auth: AuthService,private _http:HttpService) {}

  ngOnInit(): void {
    this._auth.user.subscribe((user) => {
      this.userData = user;
    });

    this.img = sessionStorage.getItem('profileImg');
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.uploadImage(selectedFile);
    }
  }

  uploadImage(file: File): void {
    const _id = JSON.parse(localStorage.getItem('user'))["_id"];

    const formData = new FormData();
    formData.append('profile_picture', file);
    formData.append('_id', _id);

    this._http.updateProfileImg(formData).subscribe((res:any) => {
      if(res.user){
        
        Swal.fire({
          title: "Success",
          text: "Profile picture updated successfully!",
          icon: "success"
        });

        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(res.user));
        
        sessionStorage.removeItem('profileImg');
        sessionStorage.setItem('profileImg',`data:image/png;base64,${res.profileImg}`);
        this.img = `data:image/png;base64,${res.profileImg}`;
        this._auth.userProfileImg.next("change")
      }
      
    })
  }

}
