import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-event-id',
  templateUrl: './event-id.component.html',
  styleUrl: './event-id.component.scss',
})
export class EventIdComponent implements OnInit {
  loadedEvent: any;
  organizer: any;

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  isEndDateInPast(): boolean {
    return (
      new Date(this.loadedEvent.end_date) > new Date() &&
      new Date(this.loadedEvent.start_date) > new Date()
    );
  }

  ngOnInit(): void {
    const datePipe = new DatePipe('en-US');

    this.route.params.subscribe((params) => {
      this.http.singleEvent(params['id']).subscribe((response: any) => {
        response.event.start_date = datePipe.transform(
          response.event.start_date,
          'dd MMMM yyyy'
        );
        response.event.end_date = datePipe.transform(
          response.event.end_date,
          'dd MMMM yyyy'
        );
        this.loadedEvent = response.event;

        this.http
          .getOrganizerData(this.loadedEvent.organizer_id)
          .subscribe((data: any) => {
            this.organizer = data.organizer;
          });
      });
    });
  }

  onApply() {
    const userId = JSON.parse(localStorage.getItem('user'))['_id'];

    const data = {
      event_id: this.loadedEvent._id,
      organizer_id: this.loadedEvent.organizer_id,
    };
    this.http.applyOnEvent(data).subscribe((res: any) => {
      if (res.message === 'success') {
        this.alertService.showAlertRedirect(
          'Success',
          'you have applied successfully',
          'success',
          'green',
          '/applied-events'
        );
      } else if (res.message === 'Already applied') {
        this.alertService.showAlertRedirect(
          'Already applied',
          'Already applied for this event',
          'success',
          'green',
          '/applied-events'
        );
      } else if (res.message === 'fail') {
        this.alertService.showAlert(
          'Error!',
          'Something went wrong!',
          'error',
          'green'
        );
      }
    });
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getEmptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
  }
}
