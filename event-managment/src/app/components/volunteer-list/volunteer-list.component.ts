import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';

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

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getVolunteers();
  }

  getVolunteers() {
    const currentUserId = JSON.parse(localStorage.getItem('user'))['_id'];
    this.http.getVolunteers(currentUserId).subscribe((res: any) => {
      this.volunteersList = res.volunteers;
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
      const newList = this.volunteersList.filter((volunteer) =>
        volunteer.username.toLowerCase().includes(term)
      );

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

  defaultList(){
    this.volunteersList = [];
    this.getVolunteers();
  }

  sortByRating(reverse:boolean) {
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
