import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  noEvents: boolean = false;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getAllEvents().subscribe((events: any) => {
      this.noEvents = false;
      events.events.forEach((event: any) => {
        const datePipe = new DatePipe('en-US');
        const today = new Date();
        const startDate = new Date(event.start_date);

        const differenceInMilliseconds = startDate.getTime() - today.getTime();
        const differenceInDays = Math.floor(
          differenceInMilliseconds / (1000 * 60 * 60 * 24)
        );

        // Add remaining_days property to the event object
        if (differenceInDays >= 0) {
          event.remaining_days = differenceInDays + 1 + ' Days to go';
        } else if (differenceInDays === -1) {
          event.remaining_days = 'OnGoing';
        } else {
          event.remaining_days = 'Completed';
        }

        // Format start_date and end_date
        event.start_date = datePipe.transform(event.start_date, 'dd MMMM yyyy');
        event.end_date = datePipe.transform(event.end_date, 'dd MMMM yyyy');
      });

      this.events = events.events.filter(
        (ev: any) =>
          ev.remaining_days != 'Completed' && ev.remaining_days != 'OnGoing'
      );

      if(this.events.length === 0){
        this.noEvents = true;
      }
    });
  }
}
