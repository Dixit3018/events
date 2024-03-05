import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userData: User;
  img: string;
  isEditMode: boolean = false;
  profileForm: FormGroup;
  citiesAndStates:string[] = []
  state:string = '';

  constructor(
    private _auth: AuthService,
    private _http: HttpService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this._http.getCities().subscribe((list: any[]) => {
      this.citiesAndStates = list['data'];
    });

    this._auth.user.subscribe((user) => {
      this.userData = user;
    });

    this.img = sessionStorage.getItem('profileImg');

    
    if(this.img === null || this.img === ''){
      this._http.getUserProfileImg().subscribe((res:any) => {
        this.img = `data:image/png;base64,${res.image}`;
        sessionStorage.setItem('profileImg', this.img);
      })
    }
    const firstname = this.userData.firstname;
    const lastname = this.userData.lastname;
    const username = this.userData.username;
    const email = this.userData.email;
    const address = this.userData.address;
    const age = this.userData.age;
    const state = this.userData.state;
    const city = this.userData.city;

    this.profileForm = this.fb.group({
      firstname: [firstname, Validators.required],
      lastname: [lastname, Validators.required],
      username: [username, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      address: [address, Validators.required],
      age: [age, Validators.required],
      state: [state, Validators.required],
      city: [city, Validators.required],
    });
    this.profileForm.get('city').disable();
  }

  setState(event: any) {
    const selectedCity = event.target.value;

    const selectedEntry = this.citiesAndStates.find((entry) => entry[0] === selectedCity);
    const selectedStatename = selectedEntry[1];
    this.state = selectedStatename;
    this.profileForm.get('state').setValue(selectedStatename);
  }

  toggleEdit() {
    if (this.profileForm.dirty) {
      this._http.updateUser(this.profileForm.value).subscribe((res:any) => {
        this._auth.user.next(res.user)
        localStorage.setItem('user',JSON.stringify(res.user));
      })
    }
    this.isEditMode = !this.isEditMode;
    if(this.isEditMode){
      this.profileForm.get('city').enable();
    }
    else{
      this.profileForm.get('city').disable();
    }
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.uploadImage(selectedFile);
    }
  }

  uploadImage(file: File): void {
    const _id = JSON.parse(localStorage.getItem('user'))['_id'];

    const formData = new FormData();
    formData.append('profile_picture', file);
    formData.append('_id', _id);

    this._http.updateProfileImg(formData).subscribe((res: any) => {
      if (res.user) {
        Swal.fire({
          title: 'Success',
          text: 'Profile picture updated successfully!',
          icon: 'success',
        });

        localStorage.setItem('user', JSON.stringify(res.user));

        sessionStorage.setItem(
          'profileImg',
          `data:image/png;base64,${res.profileImg}`
        );
        this.img = `data:image/png;base64,${res.profileImg}`;
        this._auth.userProfileImg.next('change');
      }
    });
  }
}
