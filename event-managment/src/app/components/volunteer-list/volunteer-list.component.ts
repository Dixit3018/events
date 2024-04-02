import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-volunteer-list',
  templateUrl: './volunteer-list.component.html',
  styleUrl: './volunteer-list.component.scss',
})
export class VolunteerListComponent implements OnInit {
  volunteersList: any[] = [];
  @ViewChild('searchTerm') searchTerm;
  @ViewChild('selectedSortOption') selectedSortOption;
  noMatch = false;

  currentPage: number = 1;
  pageSize: number = 8;

  getVolunteersForPage(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize - 1,
      this.volunteersList.length - 1
    );
    return this.volunteersList.slice(startIndex, endIndex + 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getTotalPages(): number {
    return Math.ceil(this.volunteersList.length / this.pageSize);
  }

  constructor(private http: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.getVolunteers();
  }

  getVolunteers() {
    this.http.getVolunteers().subscribe((res: any) => {
      this.volunteersList = res.volunteers;
    });
  }

  createInstance(recieverId: string) {
    this.http.createMsgInstance(recieverId).subscribe((res) => {
      console.log(recieverId);
      this.router.navigate(['/chat/' + recieverId]);
    });
  }

  search() {
    this.noMatch = false;
    const term = (
      this.searchTerm.nativeElement as HTMLInputElement
    ).value.toLowerCase();
    if (term === '') {
      this.getVolunteers();
    }
    if (term !== '') {
      console.log(term);
      const newList = this.volunteersList.filter((volunteer) => {
        const name = volunteer.firstname + volunteer.lastname;
        return (
          volunteer.username.toLowerCase().includes(term.trim()) ||
          name.toLowerCase().includes(term.trim())
        );
      });

      if (newList.length > 0) {
        this.volunteersList = newList;
      } else {
        this.noMatch = true;
      }
    }
  }

  sortByAge(reverse: boolean) {
    if (this.volunteersList.length > 0) {
      const sortedList = this.volunteersList
        .slice()
        .sort((a, b) => a.age - b.age);
      this.volunteersList = sortedList;
      if (reverse) this.volunteersList = this.volunteersList.reverse();
    }
  }

  onSortChange() {
    switch (this.selectedSortOption.nativeElement.value) {
      case 'age':
        this.sortByAge(false);
        break;
      case 'age-rev':
        this.sortByAge(true);
        break;
      case 'rating':
        this.sortByRating(false);
        break;
      case 'rating-rev':
        this.sortByRating(true);
        break;
      case 'default':
        this.defaultList();
        break;
    }
  }

  defaultList() {
    this.volunteersList = [];
    this.getVolunteers();
  }

  sortByRating(reverse: boolean) {
    if (this.volunteersList.length > 0) {
      const sortedList = this.volunteersList
        .slice()
        .sort((a, b) => b.rating - a.rating);
      this.volunteersList = sortedList;
      if (reverse) this.volunteersList = this.volunteersList.reverse();
    }
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getEmptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
  }
}
