import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-applied-events',
  templateUrl: './applied-events.component.html',
  styleUrl: './applied-events.component.scss',
})
export class AppliedEventsComponent implements OnInit {
  appliedEvents: any[] = [];
  noData: boolean;

  pageSize = 10;
  currentPage = 1;

  getTotalPages() {
    return Math.ceil(this.appliedEvents.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getCurrentPageAppliedEvents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize - 1,
      this.appliedEvents.length - 1
    );
    return this.appliedEvents.slice(startIndex, endIndex + 1);
  }

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-US');

    this.http.getAppliedEvents().subscribe((res: any) => {
      const applications = res.application;

      if (applications === undefined) {
        this.noData = true;
        return;
      }
      this.noData = false;
      applications.forEach((app) => {
        let status = app.status;
        this.http.singleEvent(app.event_id).subscribe((res: any) => {
          const resData = { ...res.event, status: status };
          console.log(resData);
          const today = new Date();
          //condition to show only recent applications
          // if(!(new Date(resData.start_date) > today)){
          //   return;
          // }

          resData.start_date = datePipe.transform(
            resData.start_date,
            'dd MMMM yyyy'
          );
          resData.end_date = datePipe.transform(
            resData.end_date,
            'dd MMMM yyyy'
          );

          this.appliedEvents.push(resData);
        });
      });
    });
  }
}
