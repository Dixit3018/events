import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate(1000)
      ])
    ]),
    trigger('bounce', [
      state('void', style({ transform: 'scale(0)' })),
      transition(':enter', [
        animate('2s cubic-bezier(0.68,-0.55,0.27,1.55)')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  showImage = false;
  
  eventsType: string[] = ["Environment","Bussiness","Camps","Sports"]
  achievements:{title:string,limit:number,speed:number}[]  = [
    {title:"Organizers",limit: 500,speed:30},
    {title:"Ideal Event",limit: 56,speed:50},
    {title:"New Schedule",limit: 11,speed:50},
    {title:"Volunteers",limit: 103,speed:50}
  ];
  
  ngOnInit(): void {
    register();
    setTimeout(() => {
      this.showImage = true;
    }, 1000);
  }
}
