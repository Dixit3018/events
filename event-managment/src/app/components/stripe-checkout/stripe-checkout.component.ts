import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';

import {
  StripeElementsOptions,
  StripeCardElementOptions,
} from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventFormData } from '../../shared/modals/eventFormData.modal';
import { HttpService } from '../../services/http.service';
import { AlertService } from '../../services/alert.service';
import { noNumbersValidator } from '../../shared/validators/onlyCharacters.validator';

export interface StripeCheckoutData {
  formData: EventFormData;
  file: File;
}

@Component({
  selector: 'app-stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.scss'],
})
export class StripeCheckoutComponent {
  paymentForm: FormGroup;
  stripeCardValid: boolean = false;
  amount: number;
  cardNumber: boolean = false;
  cardExpire: boolean = false;
  cardCvv: boolean = false;
  paymentInProcess: boolean = false;

  @ViewChild(StripeCardNumberComponent, { static: false })
  card: StripeCardNumberComponent;

  cardOptions: StripeCardElementOptions = {
    iconStyle: 'solid',
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: 'black',
        backgroundColor: 'white',
        fontWeight: 500,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  get validForm() {
    return this.paymentForm.valid && this.stripeCardValid;
  }

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private stripe: StripeService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<StripeCheckoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StripeCheckoutData,
    private _http: HttpService
  ) {}

  ngOnInit() {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required, noNumbersValidator]],
    });
    this.paymentService.paymentAmt.subscribe((amt) => {
      this.amount = +amt;
    });
  }

  onCardChange(event: {
    brand: string;
    complete: boolean;
    elementType: string;
    empty: boolean;
    error: string;
  }) {
    if (event.elementType === 'cardNumber' && event.complete) {
      this.cardNumber = true;
    } else if (event.elementType === 'cardExpiry' && event.complete) {
      this.cardExpire = true;
    } else if (event.elementType === 'cardCvc' && event.complete) {
      this.cardCvv = true;
    }

    if (!event.empty && this.cardNumber && this.cardCvv && this.cardExpire) {
      this.stripeCardValid = event.complete;
    }
  }

  pay() {
    this.paymentInProcess = true;
    const customerName = this.paymentForm.get('name').value;
    this.paymentService.createPaymentIntent(customerName).subscribe((val) => {
      this.stripe
        .confirmCardPayment(val.client_secret, {
          payment_method: {
            card: this.card?.element,
            billing_details: {
              name: customerName,
            },
          },
        })
        .subscribe((result: any) => {
          if (result.error) {
            // error alert
            this.alertService.showAlert(
              'Oops!',
              result.error.message,
              'error',
              'red'
            );
            this.dialogRef.close();
          } else if (result.paymentIntent.status === 'succeeded') {
            const formdata = new FormData();
            formdata.append('eventName', this.data.formData.eventName);
            formdata.append('eventVenue', this.data.formData.eventVenue);
            formdata.append(
              'eventDescription',
              this.data.formData.eventDescription
            );
            formdata.append(
              'eventNeededVolunteers',
              this.data.formData.eventNeededVolunteers
            );
            formdata.append(
              'eventPayPerDay',
              this.data.formData.eventPayPerDay
            );
            formdata.append(
              'eventStartDate',
              this.data.formData.eventStartDate
            );
            formdata.append('eventEndDate', this.data.formData.eventEndDate);
            formdata.append('eventDays', this.data.formData.eventDays);
            formdata.append('eventCity', this.data.formData.eventCity);
            formdata.append('eventState', this.data.formData.eventState);
            formdata.append('eventImage', this.data.file);

            this._http.createEvent(formdata).subscribe();
            this.dialogRef.close();
            this.paymentInProcess = false;

            // success alert
            this.alertService.showAlertRedirect(
              'Payment Succesfull!',
              'click to proceed!',
              'success',
              'green',
              '/dashboard'
            );
          }
        });
    });
  }
}
