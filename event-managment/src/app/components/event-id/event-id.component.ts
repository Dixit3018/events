import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

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
    private route: ActivatedRoute
  ) {}

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
      organizer_id: this.loadedEvent.organizer_id
    };
    this.http.applyOnEvent(data).subscribe((res: any) => {
      if (res.message === 'success') {
        Swal.fire({
          title: 'Success',
          html: 'you have applied successfully',
          icon: 'success',
          willClose: (dismiss: any) => {
            this.router.navigate(['/applied-events']);
          },
        });
      } else if (res.message === 'Already applied') {
        Swal.fire({
          title: 'Already applied',
          html: 'Already applied for this event',
          icon: 'warning',
          willClose: (dismiss: any) => {
            this.router.navigate(['/applied-events']);
          },
        });
      } else if (res.message === 'fail') {
        Swal.fire({
          title: 'Error',
          html: 'Error something went wrong!',
          icon: 'error',
        });
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
