import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { atLeastOneValidator } from '../../shared/validators/atLeastOne.validator';
import { dateRangeValidator } from '../../shared/validators/dateRange.validator';
import { minAmountValidator } from '../../shared/validators/payMinAmount.validator';
import { MatDialog } from '@angular/material/dialog';
import { StripeCheckoutComponent } from '../stripe-checkout/stripe-checkout.component';
import { PaymentService } from '../../services/payment.service';
import { EventFormData } from '../../shared/modals/eventFormData.modal';
import { CanComponentDeactivate } from '../../guards/form-candeactivate.guard';
import { limitNumberValidator } from '../../shared/validators/limitNumber.validator';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent implements CanComponentDeactivate{
  eventForm: FormGroup;
  imageFormatErr: string = '';
  minStartDate: string;
  minEndDate: string;
  imagePreview: string | ArrayBuffer | null =
    '/assets/images/image-preview.png';
  days: number = 0;
  selectedFile: File;
  eventFormData: FormData;
  
  list: any[] = [];
  state: string = '';
  
  fileSelected:boolean = false;

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private paymentService: PaymentService
  ) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.minStartDate = currentDate.toISOString().split('T')[0];
    this.minEndDate = this.minStartDate;
    
    const storedCities = sessionStorage.getItem('cities');
    if (storedCities) {
      this.list = JSON.parse(storedCities);
    } else {
      this.http.getCities().subscribe((list: any[]) => {
        this.list = list['data'];
        sessionStorage.setItem('cities', JSON.stringify(this.list));
      });
    }

    this.eventForm = this.fb.group(
      {
        eventName: ['', Validators.required],
        eventVenue: ['', Validators.required],
        eventDescription: ['', Validators.required],
        eventNeededVolunteers: ['', [Validators.required, atLeastOneValidator, limitNumberValidator(0, 500) ]],
        eventPayPerDay: [
          '',
          [Validators.required, atLeastOneValidator, minAmountValidator, limitNumberValidator(0, 500000)],
        ],
        eventStartDate: ['', Validators.required],
        eventEndDate: ['', Validators.required],
        eventDays: [0, [Validators.required, atLeastOneValidator]],
        eventCity: ['', Validators.required],
        eventState: [''],
        eventImage: ['', Validators.required],
        check: ['', Validators.requiredTrue],
      },
      { validators: [dateRangeValidator] }
    );
  }

  setState(event: any) {
    const selectedCity = event.target.value;

    const selectedEntry = this.list.find((entry) => entry[0] === selectedCity);
    this.state = selectedEntry[1];
    this.eventForm.get('eventState').setValue(this.state);

  }

  updateDays() {
    const startDate = this.eventForm.get('eventStartDate').value;
    const endDate = this.eventForm.get('eventEndDate').value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculate the difference in days
      const diffInTime = end.getTime() - start.getTime();
      this.days = Math.ceil(diffInTime / (1000 * 3600 * 24))+1;

      // Update the value in the form control
      this.eventForm.get('eventDays').setValue(this.days);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0] as File;

    if (file) {
      this.fileSelected = true
      const fileType = file.type.toLowerCase();
      
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        this.imageFormatErr = '';
        this._previewImage(file);

        const fileInp = (event.target as HTMLInputElement).files?.[0];
        this.selectedFile = fileInp;
      } else {
        this.imageFormatErr =
          'Invalid file type. Please upload a valid image (jpeg, png).';
          this.fileSelected = false;
      }
    }
  }
  canDeactivate(): boolean {
    if (this.eventForm.dirty && (!this.eventForm.valid)) {
      return window.confirm('Do you really want to leave without creating event?');
    }
    return true;
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('eventName', this.eventForm.get('eventName').value);
    formData.append('eventVenue', this.eventForm.get('eventVenue').value);
    formData.append(
      'eventDescription',
      this.eventForm.get('eventDescription').value
    );
    formData.append(
      'eventNeededVolunteers',
      this.eventForm.get('eventNeededVolunteers').value
    );
    formData.append(
      'eventPayPerDay',
      this.eventForm.get('eventPayPerDay').value
    );
    formData.append(
      'eventStartDate',
      this.eventForm.get('eventStartDate').value
    );
    formData.append('eventEndDate', this.eventForm.get('eventEndDate').value);
    formData.append('eventDays', this.eventForm.get('eventDays').value);
    formData.append('eventCity', this.eventForm.get('eventCity').value);
    formData.append('eventState', this.state.toString());
    formData.append('eventImage', this.selectedFile as File);
    this.eventFormData = formData;

    const days = +this.days ;
    const volunteers = +this.eventForm.get('eventNeededVolunteers').value;
    const pay = this.eventForm.get('eventPayPerDay').value;
    const amt = days * volunteers * pay;

    this.paymentService.setPaymentAmount(+amt);
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
      this.imagePreview = '/assets/images/image-preview.png';
    }
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const formData: EventFormData = this.eventForm.value as EventFormData;
    const file: File = this.selectedFile as File;

    this.dialog.open(StripeCheckoutComponent, {
      width: '700px',
      panelClass: 'custom-dialog',
      data: {formData, file},
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
