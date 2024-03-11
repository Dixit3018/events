import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatMessage } from '../../shared/chat-message';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;
  messages: ChatMessage[] = [];
  offlineMessages: ChatMessage[] = [];

  userId: string = JSON.parse(localStorage.getItem('user'))._id;
  recipentId: string = '';

  constructor(
    private socketService: SocketService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required],
    });

    this.route.params.subscribe((params: any) => {
      this.recipentId = params['recipent-id'];
    });
  }

  sendMessage(): void {
    this.socketService.sendMessage('hello', this.userId, this.recipentId);
  }
}
