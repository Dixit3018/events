import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatMessage } from '../../shared/chat-message';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;
  messages: any[] = [];
  showEmojiPicker = false;
  volunteer: any = {};

  @ViewChild('emojiPicker') emojiPicker: ElementRef | undefined;

  userId: string = JSON.parse(localStorage.getItem('user'))._id;
  recipentId: string = '';

  constructor(
    private socketService: SocketService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required],
    });

    this.route.params.subscribe((params: any) => {
      this.recipentId = params['recipent-id'];
    });

    this.http.getSingleUser(this.recipentId).subscribe((res: any) => {
      
      this.volunteer = {
        profilePicture: `data:image/png;base64,${res.user.profilePicture}`,
        lastname: res.user.lastname,
        firstname: res.user.firstname,
        username: res.user.username,
      };
      
    });

    this.http
      .retriveChatHistory(this.userId, this.recipentId)
      .subscribe((response: any) => {
        if (response.chatHistory.length <= 0) return;

        const msgArr = response.chatHistory[0]['messages'];

        msgArr.forEach((el) => {
          let key = {};
          if (el.sender === this.userId) {
            key = {
              from: 'sender',
              message: el.message,
              sender_id: el.sender_id,
            };
            this.messages.push(key);
          } else {
            key = {
              from: 'recipent',
              message: el.message,
              sender_id: el.sender_id,
            };
            this.messages.push(key);
          }
        });
      });

    this.socketService.onMessageSelf().subscribe((data: any) => {
      const receive = {
        from: 'sender',
        message: data.message,
        sender_id: data.sender_id,
      };
      this.messages.push(receive);
    });

    this.socketService.onMessageFrom().subscribe((data: any) => {
      const receive = {
        from: 'recipent',
        message: data.message,
        sender_id: data.sender_id,
      };
      this.messages.push(receive);
    });

    this.socketService.connect();
  }

  sendMessage(): void {
    const msg = this.messageForm.value.newMessage;
    if (msg === '') {
      return;
    }
    const sender_id = this.userId;
    this.socketService.sendMessage(msg, sender_id, this.recipentId);
    this.messageForm.reset();
  }
  addEmoji(event: any) {
    const selectedEmoji = event.emoji.native;
    this.messageForm
      .get('newMessage')
      .setValue(this.messageForm.get('newMessage').value + selectedEmoji);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.showEmojiPicker) {
      this.closeEmojiPicker();
    }
  }

  closeEmojiPicker() {
    this.showEmojiPicker = false;
  }
}
