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

  pageSize =  6;
  currentPage = 1;

  getTotalPages() {
    return Math.ceil(this.completedEvents.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getCurrentPageCompletedEvents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize - 1,
      this.completedEvents.length - 1
    );
    return this.completedEvents.slice(startIndex, endIndex + 1);
  }


  ngOnInit(): void {
    this.http
      .getCompletedEvents()
      .subscribe((data: { completedEvents: string[] }) => {
        this.completedEvents = data.completedEvents;

        data.completedEvents.forEach((event: any) => {
          this.http.getFeedback(event._id).subscribe((data: any) => {
            event.review = data.feedback.review;
          });
        });
      });
  }

  getStars(value:number) {
    let stars = [];
    for (let i = 0; i < value; i++) {
      stars.push(1);
    } 
    return stars
  }
}
