import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.scss',
})
export class ChatScreenComponent implements OnInit, OnDestroy {
  users: any[] = [];
  activeId: string = '';
  filteredUsers: any[] = [];
  searchForm: FormGroup;
  onScreen: boolean = true;

  notifySound: HTMLAudioElement;

  constructor(
    private http: HttpService,
    private chatService: ChatService,
    private auth: AuthService,
    private fb: FormBuilder,
    private socketService: SocketService,
    private route:ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
  }
  playNotifySound() {
    this.notifySound.play();
  }

  markRead(sender_id: string) {

  }

  ngOnInit(): void {
    this.notifySound = new Audio();
    this.notifySound.src = '/assets/sounds/chat-notification.mp3';
    this.notifySound.load();

    this.chatService.selectedId.subscribe((id: string) => {
      Promise.resolve().then(() => (this.activeId = id));
    });

    this.chatService.unshiftUser.subscribe((id: string) => {
      this.filteredUsers.forEach((user) => {
        if (user.id === id) {
          this.shiftUser(user);
        }
      });
    });

    this.http.getUsers().subscribe((response: any) => {
      response.users.forEach((user: any) => {
        const data = {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          profilePicture: user.profilePicture,
          unread: 0,
        };
        this.users.push(data);
      });
    });

    const storedUsers = JSON.parse(sessionStorage.getItem('chatList'));

    if (storedUsers != null && storedUsers.length !== 0) {
      this.filteredUsers = storedUsers;
    } else {
      this.filteredUsers = this.users;
    }

    // Subscribe to changes in the search query form control
    this.searchForm.get('searchQuery').valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }

  filterUsers() {
    const searchQuery = this.searchForm.get('searchQuery').value.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchQuery) ||
        user.lastname.toLowerCase().includes(searchQuery) ||
        user.username.toLowerCase().includes(searchQuery)
    );
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('chatList');
  }

  storeUsers() {
    sessionStorage.setItem('chatList', JSON.stringify(this.filteredUsers));
  }

  shiftUser(user: any) {
    const index = this.filteredUsers.indexOf(user);
    this.filteredUsers.splice(index, 1);
    this.filteredUsers.unshift(user);
  }
}
