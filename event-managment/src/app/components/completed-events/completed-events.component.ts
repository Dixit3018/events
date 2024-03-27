import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-completed-events',
  templateUrl: './completed-events.component.html',
  styleUrl: './completed-events.component.scss',
})
export class CompletedEventsComponent implements OnInit {
  completedEvents: any[] = [];

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http
      .getCompletedEvents()
      .subscribe((data: { completedEvents: string[] }) => {
        this.completedEvents = data.completedEvents;
        console.log(this.completedEvents);
        
      });
  }
}
