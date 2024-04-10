import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  clickedOnce: boolean = false;
  siteKey: string = environment.recaptcha.siteKey;
  public captchaResolved: boolean = false;

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.contactForm = this.fb.group({
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
    this.clickedOnce = true;
    const data = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    this.http.storeContactForm(data).subscribe({
      next: (res: any) => {
        if (res.message === 'success') {
          this.alertService.showAlert(
            'Success',
            'your message has been sent successfully',
            'success',
            'green'
          );
          this.contactForm.reset();
        }
      },
      error: (error) => {
        this.alertService.showAlert(
          'Oops!',
          error.error.message,
          'error',
          'red'
        );
      },
      complete: () => {
        this.clickedOnce = false;
      },
    });
  }
}
