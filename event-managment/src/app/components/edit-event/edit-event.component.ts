import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../shared/modals/event.modal';
import { AlertService } from '../../services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss',
})
export class EditEventComponent implements OnInit, OnDestroy {
  currentEvent: Event;
  eventImg: string = '';
  updateForm: FormGroup;
  updateImage: FormGroup;
  formChange: boolean = false;

  citiesAndStates = [];

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.http.singleEvent(params['id']).subscribe((res: { event: Event }) => {
        this.currentEvent = res.event;
        this.eventImg = this.currentEvent.cover_img;

        this.updateForm = this.fb.group({
          name: [this.currentEvent.name, Validators.required],
          venue: [this.currentEvent.venue, Validators.required],
          description: [this.currentEvent.description, Validators.required],
          city: [this.currentEvent.city, Validators.required],
          state: [this.currentEvent.state, Validators.required],
        });

        this.updateForm.valueChanges.subscribe(() => {
          this.formChange = true;
        });

        this.http.getCities().subscribe((list: any[]) => {
          this.citiesAndStates = list['data'];
        });
      });
    });
  }

  onUpdate() {
    if (!this.formChange) {
      this.alertService.showConfirmBox(
        'Are you Sure?',
        'No changes made in the form',
        'Yes',
        '/event-list'
      );
      return;
    } else {
      const eventData = this.updateForm.value;
      eventData.eventId = this.currentEvent._id;

      this.http.updateEventData(eventData).subscribe({
        next: (res) => {
          this.alertService.showAlertRedirect(
            'Updated',
            'Data updated successfully',
            'success',
            'green',
            '/event-list'
          );
        },
        error: (error) => {
          console.log(error);
          this.alertService.showAlert('Error', error.message, 'error', 'green');
        },
      });
    }
  }

  openFileInp() {
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedExtensions.includes(file.type)) {
      this.alertService.showAlert(
        'Invalid',
        'Please select a valid JPEG, PNG or JPG file',
        'warning',
        'green'
      );
      inputElement.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => (this.eventImg = reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('eventId', this.currentEvent._id);
    formData.append('eventImage', file);

    this.http.updateEventImage(formData).subscribe({
      next: (res: { message: string; event: Event }) => {
        if (res.message == 'success') {
          this.alertService.showAlert(
            'Updated',
            'Event image updated successfully',
            'success',
            'green'
          );
          inputElement.value = '';
        }
      },
      error: (error) =>
        this.alertService.showAlert('Error', error.message, 'error', 'green'),
    });
  }

  setState(event: any) {
    const selectedCity = event.target.value;
    const selectedEntry = this.citiesAndStates.find(
      (entry) => entry[0] === selectedCity
    );
    const selectedStatename = selectedEntry[1];
    this.updateForm.get('state').setValue(selectedStatename);
  }

  navigateBack() {
    this.router.navigate(['/event-list']);
  }

  ngOnDestroy(): void {}
}
