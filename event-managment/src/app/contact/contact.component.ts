import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  siteKey: string = environment.recaptcha.siteKey;
  public captchaResolved: boolean = false;

  center = { lat: 37.7749, lng: -122.4194 };

  constructor(private http: HttpService, private fb: FormBuilder) {
    this.contactForm = fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      recaptchaReactive: ['', [Validators.required]],
    });
  }
  checkCaptcha(captchaResponse: string) {
    this.captchaResolved =
      captchaResponse && captchaResponse.length > 0 ? true : false;
  }
  ngOnInit(): void {}

  onSubmit() {
    const formData = this.contactForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    this.http.storeContactForm(data).subscribe((res: any) => {
      if (res.message === 'success') {
        Swal.fire({
          title: 'Success',
          html: 'your message has been sent successfully',
          icon: 'success',
          willClose: (dismiss: any) => {
            this.contactForm.reset();
          },
        });
      }
    });
  }
}
