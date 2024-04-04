import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';

interface profileDetails {
  address: string;
  age: number;
  city: string;
  email: string;
  firstname: string;
  lastname: string;
  profilePicture: string;
  rating: any;
  role: string;
  state: string;
  username: string;
  _id: string;
}

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss',
})
export class VolunteerComponent implements OnInit {
  profileDetails;

  constructor(private http: HttpService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.http.getSingleVolunteer(params['id']).subscribe((res:{volunteer:profileDetails}) => {
        this.profileDetails = res.volunteer;
      });
    });
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getEmptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
  }
}
