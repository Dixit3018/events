import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.scss'
})
export class ChatScreenComponent implements OnInit {

  constructor(private http:HttpService){}

  ngOnInit(): void {
      this.http.getVolunteers().subscribe((response:any) => {
        console.log(response);
        
      })
  }
}
