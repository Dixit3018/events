import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

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
  citiesAndStates: string[] = [];
  state: string = '';

  constructor(
    private _auth: AuthService,
    private _http: HttpService,
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this._http.getCities().subscribe((list: any[]) => {
      this.citiesAndStates = list['data'];
    });

    this._auth.user.subscribe((user) => {
      this.userData = user;
      this.img = user.profilePicture;
    });

    const { firstname, lastname, username, email, address, age, state, city } =
      this.userData;

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

    const selectedEntry = this.citiesAndStates.find(
      (entry) => entry[0] === selectedCity
    );
    const selectedStatename = selectedEntry[1];
    this.state = selectedStatename;
    this.profileForm.get('state').setValue(selectedStatename);
  }

  toggleEdit() {
    if (this.profileForm.dirty) {
      this._http.updateUser(this.profileForm.value).subscribe((res: any) => {
        this._auth.user.next(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      });
      this.profileForm.markAsPristine();
    }
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.profileForm.get('city').enable();
    } else {
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

    this._http.updateProfileImg(formData).subscribe((res: any) => {
      if (res.user) {
        Swal.fire({
          title: 'Success',
          text: 'Profile picture updated successfully!',
          icon: 'success',
        });

        console.log(res.profileImg);

        localStorage.setItem('user', JSON.stringify(res.user));

        this.dataService.userImageChange(res.profileImg);

        sessionStorage.setItem('profileImg', res.profileImg);
        this.img = res.profileImg;
      }
    });
  }
}
