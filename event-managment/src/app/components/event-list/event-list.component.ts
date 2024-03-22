import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit {
  eventsList = [];
  sortOrder: string = 'asc';

  constructor(private _http: HttpService,private router:Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this._http.getEvent().subscribe((res: any) => {
      
      this.eventsList = res.events;
      
    });
  }

  openDetails(eventData:any,enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(EventDetailsComponent, {
      data: {eventData},
      width: '1000px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        console.log(result);
      };
    });
  }

  getStatus(start_date: Date, end_date: Date): string {
    const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const startDateMidnight = new Date(start_date);
  startDateMidnight.setHours(0, 0, 0, 0);

  const endDateMidnight = new Date(end_date);
  endDateMidnight.setHours(0, 0, 0, 0);

  if (startDateMidnight.getTime() > currentDate.getTime()) {
    return 'Upcoming';
  } else if (
    endDateMidnight.getTime() >= currentDate.getTime() &&
    startDateMidnight.getTime() <= currentDate.getTime()
  ) {
    return 'Ongoing';
  } else {
    return 'Completed';
  }
  }

  changeSortOrder(event:any): void {
    this.sortOrder = event.target.value;
    this.sortEvents('start_date');
  }

  sortEvents(property: string): void {
    this.eventsList.sort((a, b) => {
      const aValue = new Date(a[property]).getTime();
      const bValue = new Date(b[property]).getTime();

      if (aValue < bValue) {
        return this.sortOrder === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
