import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notSelectedValidator } from '../../shared/validators/select.validator';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { LoginData } from '../login/login.component';
import { ageRangeValidator } from '../../shared/validators/ageRangeValidator';
import { limitCharacterValidator } from '../../shared/validators/limitCharacter.validator';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  personalInfoFormGroup: FormGroup;
  credentialsForm: FormGroup;
  signupForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  citiesAndStates: [];
  state: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private _http: HttpService,
    private cryptoService: CryptoService
  ) {}

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

  ngOnInit(): void {
    this.signupForm = this._formBuilder.group({
      credentials: this._formBuilder.group({
        uname: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(this.passwordPattern),
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
      }),
      personalInfo: this._formBuilder.group({
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }),
      generalInfo: this._formBuilder.group({
        image: [null],
        age: ['', [Validators.required, ageRangeValidator]],
        address: ['', [Validators.required, limitCharacterValidator(150)]],
        city: ['Select City', [Validators.required, notSelectedValidator()]],
        state: ['', [Validators.required, notSelectedValidator()]],
        role: ['volunteer', Validators.required],
      }),
    });
    
    this._http.getCities().subscribe((list: any[]) => {
      this.citiesAndStates = list['data'];
    });
  }

  setState(event: any) {
    const selectedCity = event.target.value;

    const selectedEntry = this.citiesAndStates.find(
      (entry) => entry[0] === selectedCity
    );
    const selectedStatename = selectedEntry[1];
    this.state = selectedStatename;
    this.signupForm.get('generalInfo.state').setValue(selectedStatename);
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('uname', this.signupForm.get('credentials.uname').value);
    formData.append(
      'password',
      this.signupForm.get('credentials.password').value
    );

    formData.append('fname', this.signupForm.get('personalInfo.fname').value);
    formData.append('lname', this.signupForm.get('personalInfo.lname').value);
    formData.append('email', this.signupForm.get('personalInfo.email').value);

    formData.append('age', this.signupForm.get('generalInfo.age').value);
    formData.append(
      'address',
      this.signupForm.get('generalInfo.address').value
    );
    formData.append('city', this.signupForm.get('generalInfo.city').value);
    formData.append('state', this.signupForm.get('generalInfo.state').value);
    formData.append('role', this.signupForm.get('generalInfo.role').value);

    const imageFile = this.signupForm.get('generalInfo.image');

    if (imageFile && imageFile) {
      formData.append('image', imageFile.value);
    } else {
      formData.append('image', '');
    }

    // Register user method
    this._auth.register(formData).subscribe((data: LoginData) => {
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', this.cryptoService.encrypt(JSON.stringify(data.token)));
        localStorage.setItem('expiry', JSON.stringify(data.expiresIn));
        this._auth.user.next(data.user);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  getValidationImagePath(validate: string): string {
    if (
      this.signupForm.get('credentials.password').value === '' ||
      this.signupForm.get('credentials.password').value === null
    ) {
      return '/assets/icons/cross.png';
    }
    return this.signupForm.get('credentials.password').hasError(validate)
      ? '/assets/icons/cross.png'
      : '/assets/icons/correct.png';
  }

  onFileChange(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 0) {
      this.signupForm.get('generalInfo.image').setValue(files[0]);
      this._previewImage(files[0]);
    }
  }

  private _previewImage(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = '/assets/images/profile/default-profile.png';
    }
  }
}
