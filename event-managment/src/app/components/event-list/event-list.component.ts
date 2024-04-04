import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit {
  eventsList = [];
  displayEvents = [];
  sortOrder: string = 'desc';

  pageSize = 6;
  currentPage = 1;

  getTotalPages() {
    return Math.ceil(this.displayEvents.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getEventsForPage(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize - 1,
      this.displayEvents.length - 1
    );
    return this.displayEvents.slice(startIndex, endIndex + 1);
  }

  constructor(
    private _http: HttpService,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getEventData();
    this.dataService.feedbackChanged.subscribe((change) => {
      this.getEventData();
    });
  }

  getEventData() {
    this._http.getEvent().subscribe((res: any) => {
      this.eventsList = res.events;
      this.displayEvents = this.eventsList;
      this.sortEvents('start_date');
    });
  }
  openDetails(
    eventData: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogRef = this.dialog.open(EventDetailsComponent, {
      data: { eventData },
      width: '1000px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
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

  changeSortOrder(event: any): void {
    this.sortOrder = event.target.value;
    this.sortEvents('start_date');
  }

  sortEvents(property: string): void {
    this.displayEvents.sort((a, b) => {
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

  filterEvents(event: any): void {
    const filterOn = event.target.value;

    const currentDate = this.convertDate(new Date().toString())

    switch (filterOn) {
      case 'all':
        this.displayEvents = this.eventsList;
        break;
      case 'upcoming':
        this.displayEvents = this.eventsList.filter((eventData) => {
          const eventStartDate = this.convertDate(eventData.start_date);
          return eventStartDate > currentDate;
        });
        break;
      case 'ongoing':
        this.displayEvents = this.eventsList.filter((eventData) => {
          const eventEndDate = this.convertDate(eventData.start_date);
          const eventStartDate = this.convertDate(eventData.end_date);
          return eventStartDate <= currentDate && eventEndDate >= currentDate;
        });
        break;
      case 'completed':
        this.displayEvents = this.eventsList.filter((eventData) => {
          const eventEndDate = this.convertDate(eventData.end_date);
          return eventEndDate < currentDate;
        });
        break;
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
}
