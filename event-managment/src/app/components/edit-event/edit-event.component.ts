import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss',
})
export class EditEventComponent implements OnInit {
  eventId: string = '';

  constructor(private _http:HttpService, private router: Router, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('id');
    });
  }

  ngOnInit(): void {
    this._http.singleEvent(this.eventId).subscribe(event => {
      console.log(event);
    })
  }
}
