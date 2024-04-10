import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { HttpService } from '../../../services/http.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':enter, :leave', [animate(1000)]),
    ]),
    trigger('bounce', [
      state('void', style({ transform: 'scale(0)' })),
      transition(':enter', [animate('2s cubic-bezier(0.68,-0.55,0.27,1.55)')]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpService) {}

  showImage = false;
  events = [];
  upcomingEvents: any[] = [];
  ongoingEvents: any[] = [];
  completedEvents: any[] = [];

  displayCountUpcoming = 6;
  displayCountOngoing = 6;
  displayCountCompleted = 6;

  achievements: { title: string; limit: number; speed: number }[] = [];

  ngOnInit(): void {
    this.http
      .homePageData()
      .subscribe(
        (res: {
          message: string;
          organizers: string;
          volunteers: string;
          newScheduledEvents: string;
          idealEvents: string;
          upcomingEvents: [];
          ongoingEvents: [];
          completedEvents: [];
        }) => {
          this.achievements.push(
            { title: 'Organizers', limit: +res.organizers, speed: 30 },
            { title: 'Ideal Event', limit: +res.idealEvents, speed: 50 },
            {
              title: 'New Schedule',
              limit: +res.newScheduledEvents,
              speed: 50,
            },
            { title: 'Volunteers', limit: +res.volunteers, speed: 50 }
          );

          this.upcomingEvents = res.upcomingEvents;
          this.ongoingEvents = res.ongoingEvents;
          this.completedEvents = res.completedEvents;
        }
      );
    register();
    setTimeout(() => {
      this.showImage = true;
    }, 1000);
  }

  loadMoreUpcoming(){
    this.displayCountUpcoming += 6
  }

  loadMoreOngoing() {
    this.displayCountOngoing += 6
  }

  loadMoreCompleted() {
    this.displayCountCompleted += 6
  }
}
