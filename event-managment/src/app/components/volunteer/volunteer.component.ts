import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss'
})
export class VolunteerComponent implements OnInit{

  constructor(private http: HttpService, private route:ActivatedRoute) {}

ngOnInit(): void {
  this.route.params.subscribe(params => {
    
    this.http.getSingleVolunteer(params['id']).subscribe(volunteer => {
      console.log(volunteer);
    })

  })
}

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getEmptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
  }
}
