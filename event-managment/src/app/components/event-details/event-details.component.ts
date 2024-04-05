import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../shared/modals/event.modal';
import { HttpService } from '../../services/http.service';
import { User } from '../../models/user.model';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  eventData: Event;
  currentDate = new Date().toISOString();
  participants: {
    _id: string;
    username: string;
    profilePicture: string;
    rating: 0;
  }[] = [];
  feedbacks: { rate: number; userId: string; eventId: string; role: string }[] =
    [];
  feedbackStatus: boolean = false;

  feedBackHistory = [];

  rating = 0;
  stars = [
    { filled: false, value: 5 },
    { filled: false, value: 4 },
    { filled: false, value: 3 },
    { filled: false, value: 2 },
    { filled: false, value: 1 },
  ];

  constructor(
    private http: HttpService,
    private dataService: DataService,
    private alertService: AlertService,
    private router: Router,
    private dialogRef: MatDialogRef<EventDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventData: Event }
  ) {}

  ngOnInit(): void {
    this.fillStars(this.rating);
    const volunteers = this.data.eventData.hired_volunteers;

    if (
      this.convertDate(this.data.eventData.end_date) <
        this.convertDate(new Date().toString()) &&
      this.data.eventData.feedbackStatus === false
    ) {
      this.feedbackStatus = true;
    } else {
      //get feedbacks to display

      this.feedbackStatus = false;
      console.log(this.feedbackStatus);
      this.http
        .getEventFeedbacks(this.data.eventData._id)
        .subscribe((res: any) => {
          this.feedBackHistory = res.feedbacks;
        });
    }

    volunteers.forEach((volunteerId) => {
      this.http.getSingleUser(volunteerId).subscribe((res: { user: User }) => {
        this.participants.push({
          _id: res.user._id,
          username: res.user.username,
          profilePicture: res.user.profilePicture,
          rating: 0,
        });
      });
    });
    this.eventData = this.data.eventData;
  }

  rate(participant: any, value: number) {
    participant.rating = value;
    console.log(participant);

    this.fillStars(value);
    this.feedbacks.push({
      rate: +value,
      userId: participant._id,
      eventId: this.eventData._id,
      role: 'volunteer',
    });
  }

  fillStars(value: number) {
    this.stars.forEach((star) => {
      star.filled = star.value <= value;
    });
  }

  SubmitFeedback() {
    this.http.giveFeedbackToVolunteer(this.feedbacks).subscribe(() => {
      this.dataService.feedbackChanged.next(true);
      this.dialogRef.close();
    });
  }

  navigateToEdit(event_id: string) {
    if (this.participants.length > 0) {
      this.alertService.showAlert(
        'Error',
        'You cannot change the event data as a user has participated',
        'error',
        'green'
      );
    } else {
      this.router.navigate(['/edit-event/' + event_id]);
      this.closeDialog();
    }
  }

  convertDate(date: string) {
    const dateToReturn = new Date(date);
    return new Date(
      dateToReturn.getFullYear(),
      dateToReturn.getMonth(),
      dateToReturn.getDate()
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
