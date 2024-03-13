import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.scss',
})
export class ChatScreenComponent implements OnInit {
  users: any[] = [];
  activeId: string = '';
  userId: string = '';
  filteredUsers: any[] = [];
  searchForm: FormGroup;

  constructor(
    private http: HttpService,
    private chatService: ChatService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
  }

  ngOnInit(): void {
    this.chatService.selectedId.subscribe((id: string) => {
      this.activeId = id;
    });
    this.auth.user.subscribe((user: any) => {
      this.userId = user._id;
    });

    this.http.getUsers(this.userId).subscribe((response: any) => {
      response.users.forEach((user: any) => {
        const data = {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          profilePicture: user.profilePicture,
        };
        this.users.push(data);
      });
    });

    this.filteredUsers = this.users;
    
    // Subscribe to changes in the search query form control
    this.searchForm.get('searchQuery').valueChanges.subscribe(() => {
      this.filterUsers();
    });

  }

  filterUsers() {
    console.log("filter called");
    
    const searchQuery = this.searchForm.get('searchQuery').value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstname.toLowerCase().includes(searchQuery) ||
      user.lastname.toLowerCase().includes(searchQuery) ||
      user.username.toLowerCase().includes(searchQuery)
    );
  }
}
