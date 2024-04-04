import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss',
})
export class ApplicationListComponent implements OnInit {
  applications: any[] = [];
  constructor(private http: HttpService) {}

  pageSize =  10;
  currentPage = 1;

  getTotalPages() {
    return Math.ceil(this.applications.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getCurrentPageApplications() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize - 1,
      this.applications.length - 1
    );
    return this.applications.slice(startIndex, endIndex + 1);
  }

  @ViewChild(MatPaginator) paginator:MatPaginator;

  ngOnInit(): void {
    this.getApplicationDetails();
  }

  getApplicationDetails() {
    this.http.getApplicationList().subscribe((res: any) => {
      this.applications = res.data;
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
