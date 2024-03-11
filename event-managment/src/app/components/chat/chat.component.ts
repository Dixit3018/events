import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatMessage } from '../../shared/chat-message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'], // Fix styleUrl to styleUrls
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;
  messages: ChatMessage[] = [];
  offlineMessages: ChatMessage[] = [];

  constructor(
    // private socketService: SocketService,
     private fb: FormBuilder) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required],
    });

    const userId = JSON.parse(localStorage.getItem('user'))._id;
  }

  sendMessage(): void {}
}
