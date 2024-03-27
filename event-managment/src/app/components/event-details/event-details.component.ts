import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../shared/modals/event.modal';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  eventData: Event;
  participants: { _id: string; username: string; profilePicture: string }[] =
    [];
  feedbacks: { rate: number; userId: string }[] = [];
  feedbackStatus: boolean = false;

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
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { eventData: Event }
  ) {
    this.fillStars(this.rating);
    const volunteers = data.eventData.hired_volunteers;

    if (new Date(data.eventData.end_date) < new Date()) {
      this.feedbackStatus = true;
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
    this.eventData = data.eventData;
  }

  ngOnInit(): void {}

  rate(value: number, userId: string) {
    // Update the rating and fill stars accordingly
    this.rating = value;
    this.fillStars(value);

    if (this.feedbacks.length > 0) {
      this.feedbacks.forEach((feedback) => {
        if (feedback.userId === userId) {
          feedback.rate = value;
        }
      });
    } else {
      this.feedbacks.push({ rate: value, userId: userId });
    }
  }

  fillStars(value: number) {
    // Fill stars up to the selected value
    this.stars.forEach((star) => {
      star.filled = star.value <= value;
    });
  }

  SubmitFeedback() {
    console.log(this.feedbacks);
  }
}
