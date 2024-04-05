import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';


import { AuthService, User } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../services/alert.service';
import { ageRangeValidator } from '../../shared/validators/ageRangeValidator';
import { limitCharacterValidator } from '../../shared/validators/limitCharacter.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userData: User;
  img: string;
  profileForm: FormGroup;
  state: string = '';
  fileErr: string = '';
  citiesAndStates: string[] = [];
  completedTasks: { name: string; created_at: string }[] = [];

  isEditMode: boolean = false;
  fileSelected: boolean = false;

  pageSize = 5;
  currentPage = 1;

  getTotalPages() {
    return Math.ceil(this.completedTasks.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getCurrentPageTasks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize - 1,
      this.completedTasks.length - 1
    );
    return this.completedTasks.slice(startIndex, endIndex + 1);
  }

  constructor(
    private _auth: AuthService,
    private _http: HttpService,
    private fb: FormBuilder,
    private dataService: DataService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this._http.getCities().subscribe((list: any[]) => {
      this.citiesAndStates = list['data'];
    });

    this._auth.user.subscribe((user) => {
      this.userData = user;
      this.img = user.profilePicture;
    });

    this._http
      .getCompletedTask()
      .subscribe((res: { message: string; tasks: [] }) => {
        res.tasks.map((task: any) => {

          this.completedTasks.push({
            name: task.name,
            created_at: this.datePipe.transform(new Date(task.createdAt), 'dd/MM/yy'),
          });
        });        
      });

    const { firstname, lastname, username, email, address, age, state, city } =
      this.userData;

    this.profileForm = this.fb.group({
      firstname: [firstname, Validators.required],
      lastname: [lastname, Validators.required],
      username: [username, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      address: [address, [Validators.required, limitCharacterValidator(150)]],
      age: [age, [Validators.required, ageRangeValidator]],
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
      if (!this.profileForm.valid) {
        this.alertService.showAlert(
          'Invalid Form',
          'Please enter the details correctly',
          'warning',
          'green'
        );
        return;
      }

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
    if (file.type == '') {
      this.fileErr = 'Please select a file';
      return;
    }

    if (file) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.indexOf(fileExtension) === -1) {
        this.fileErr =
          'Invalid file format. only JPG, JPEG, and PNG files are allowed.';

        return;
      }
      this.fileSelected = true;
      this.fileErr = '';
    } else {
      this.fileSelected = false;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    this._http.updateProfileImg(formData).subscribe((res: any) => {
      if (res.user) {
        this.alertService.showAlert(
          'Success',
          'Profile picture updated successfully!',
          'success',
          'green'
        );
        const user = res.user;
        user.profileImg = res.profileImg;

        this._auth.user.next(user);

        localStorage.setItem('user', JSON.stringify(user));

        this.dataService.userImageChange(res.profileImg);

        this.img = res.profileImg;
      }
    });
  }
}
