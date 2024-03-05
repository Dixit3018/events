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

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-US');
    const userId = JSON.parse(localStorage.getItem('user'))['_id'];

    this.http.getAppliedEvents({ id: userId }).subscribe((res: any) => {
      const applications = res.application;

      applications.forEach((app) => {
        let status = app.status;
        this.http.singleEvent(app.event_id).subscribe((res: any) => {
          const resData = { ...res.event, status: status };
          const today = new Date();
          if(!(new Date(resData.start_date) > today)){
            return;
          }
          
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
