import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss',
})
export class ApplicationListComponent implements OnInit {
  applications: any[] = [];
  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getApplicationDetails();
  }

  getApplicationDetails() {
    this.http.getApplicationList().subscribe((res: any) => {
      this.applications = res.data;
      console.log(this.applications);
    });
  }

  onAction(action: string, applicationId: string,volunteerId:string) {
    this.http
      .updateApplicationStatus({ application_id: applicationId, status: action, volunteer_id:volunteerId })
      .subscribe((res: any) => {
        this.getApplicationDetails();
      });
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getEmptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
  }
}
