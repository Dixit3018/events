import { Component,EventEmitter,Input, Output } from '@angular/core';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Output() pageChange = new EventEmitter<number>();

  constructor() { }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
  
  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
