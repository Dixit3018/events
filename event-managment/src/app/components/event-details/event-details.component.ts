import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../shared/modals/event.modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  eventData: Event;

  constructor(private router:Router,@Inject(MAT_DIALOG_DATA) public data: { eventData: Event }) {
    this.eventData = data.eventData;
  }

  ngOnInit(): void {}

  onEdit(id:string) {
    this.router.navigate(['/edit-event',id])
    
  }
}
