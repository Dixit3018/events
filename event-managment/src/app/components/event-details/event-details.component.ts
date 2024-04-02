import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../shared/modals/event.modal';
import { HttpService } from '../../services/http.service';
import { User } from '../../models/user.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  eventData: Event;

  participants: { _id: string; username: string; profilePicture: string }[] =
    [];
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
    private dialogRef: MatDialogRef<EventDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventData: Event }
  ) {}

  ngOnInit(): void {
    this.fillStars(this.rating);
    const volunteers = this.data.eventData.hired_volunteers;

    if (
      new Date(this.data.eventData.end_date) < new Date() &&
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
        });
      });
    });
    this.eventData = this.data.eventData;
  }

  rate(value: number, userId: string) {
    this.rating = value;
    this.fillStars(value);

    if (this.feedbacks.length > 0) {
      this.feedbacks.forEach((feedback) => {
        if (feedback.userId === userId) {
          feedback.rate = value;
        }
      });
    } else {
      this.feedbacks.push({
        rate: value,
        userId: userId,
        eventId: this.eventData._id,
        role: 'volunteer',
      });
    }
  }

  fillStars(value: number) {
    // Fill stars up to the selected value
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
  closeDialog() {
    this.dialogRef.close();
  }
}
