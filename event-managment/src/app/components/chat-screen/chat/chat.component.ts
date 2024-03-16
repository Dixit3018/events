import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SocketService } from '../../../services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { ChatService } from '../../../services/chat.service';
import { Subscription } from 'rxjs';

function randomID(len: number) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageForm: FormGroup;
  messages: any[] = [];
  showEmojiPicker = false;
  volunteer: any = {};
  roomId: string = '';
  sendAudio: HTMLAudioElement;
  recieveAudio: HTMLAudioElement;

  @ViewChild('emojiPicker') emojiPicker: ElementRef | undefined;
  @ViewChild('messageContainer') messageContainer: ElementRef;

  userId: string = JSON.parse(localStorage.getItem('user'))._id;
  recipentId: string = '';
  sendMsgSubscription: Subscription;
  selfSendMsgSubscription: Subscription;
  fromMsgSubscription: Subscription;

  constructor(
    private socketService: SocketService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.sendAudio = new Audio();
    this.sendAudio.src = '/assets/sounds/chat-send.mp3'; // Update with the path to your sound file
    this.sendAudio.load();

    this.recieveAudio = new Audio();
    this.recieveAudio.src = '/assets/sounds/chat-recieve.mp3'; // Update with the path to your sound file
    this.recieveAudio.load();

    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required],
    });

    this.socketService.onReadRecipt().subscribe(() => {
      this.retriveHistory();
    });

    this.route.params.subscribe((params: any) => {
        this.roomId = randomID(5);
        
      this.messages = [];
      this.messageForm.reset();
      this.volunteer = {};

      this.recipentId = params['recipent-id'];
      this.chatService.setSelectedChatId(this.recipentId);

      this.chatService.unReadMsg.next({
        senderId: this.recipentId,
        totalCount: null,
      });
      localStorage.removeItem(this.recipentId);

      //mark read message
      this.markMsgRead();

      this.http.getSingleUser(this.recipentId).subscribe((res: any) => {
        
        this.volunteer = {
          profilePicture: `data:image/png;base64,${res.user.profilePicture}`,
          lastname: res.user.lastname,
          firstname: res.user.firstname,
          username: res.user.username,
        };
      });
    });

    this.selfSendMsgSubscription = this.socketService.onMessageSelf().subscribe((data: any) => {
      const sent = {
        from: 'sender',
        message: data.message,
        sender_id: data.sender_id,
      };
      this.messages.push(sent);
      this.sentSound();
    });

    this.fromMsgSubscription = this.socketService.onMessageFrom().subscribe((data: any) => {
      const receive = {
        from: 'recipent',
        message: data.message,
        sender_id: data.sender_id,
      };

      if (data.sender_id == this.recipentId) {
        this.messages.push(receive);
        this.recieveSound();
        this.markMsgRead();
      } else {
        this.chatService.setUnReadMsg(receive.sender_id, 1);
      }
    });

    this.socketService.connect();
  }

  retriveHistory() {
    this.messages = [];
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
              isRead: el.isRead,
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
  }

  markMsgRead() {
    this.socketService.markRead(this.userId, this.recipentId);
    this.retriveHistory();
  }
  sentSound(): void {
    this.sendAudio.play();
  }

  recieveSound(): void {
    this.recieveAudio.play();
  }

  sendMessage(): void {
    const msg = this.messageForm.value.newMessage;
    if (msg === '' || msg === null) {
      return;
    }
    const sender_id = this.userId;
    this.socketService.sendMessage(msg, sender_id, this.recipentId);
    this.chatService.unshiftUser.next(this.recipentId);
    this.messageForm.reset();
  }

  addEmoji(event: any) {
    const selectedEmoji = event.emoji.native;
    const msg = this.messageForm.get('newMessage').value;

    if (msg === null) {
      this.messageForm.get('newMessage').setValue(selectedEmoji);
    } else {
      this.messageForm
        .get('newMessage')
        .setValue(this.messageForm.get('newMessage').value + selectedEmoji);
    }
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

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  openInNewTab(): void {
    const route = 'call/' + this.roomId;
    const url = this.router.createUrlTree([route]);
    const msg = `Please join meeting : <a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="http://localhost:4200${url}" target='_blank'>http://localhost:4200${url}</a>`;
    this.socketService.sendMessage(msg, this.userId, this.recipentId);
    // this.chatService.unshiftUser.next(this.recipentId);
    window.open(url.toString(), '_blank');
  }

  ngOnDestroy(): void {
    this.chatService.setSelectedChatId(null);
    this.fromMsgSubscription.unsubscribe();
    this.selfSendMsgSubscription.unsubscribe();
  }
}

