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
    const id = JSON.parse(localStorage.getItem('user'))['_id'];
    this.http.getApplicationList({ id: id }).subscribe((res: any) => {
      this.applications = res.data;
      console.log(this.applications);
    });
  }

  onAction(applicationId: string, action: string) {
    this.http
      .updateApplicationStatus({ id: applicationId, status: action })
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
