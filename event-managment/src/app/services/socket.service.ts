import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  sender_id: string = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user'))['_id'] : '';
  constructor(private socket: Socket) {}

  connect(): void {
    this.socket.connect();
  }

  sendMessage(message: string, sender_id: string, recipent_id: string) {
    this.sender_id = sender_id;
    this.socket.emit('msg', {
      message: message,
      sender_id: sender_id,
      recipent_id: recipent_id,
    });
  }

  onMessageSelf(): Observable<any> {
    return this.socket.fromEvent('msg');
  }
  onMessageFrom(): Observable<any> {
    return this.socket.fromEvent(this.sender_id);
  }
  
  markRead(sender:string,recipient:string) {
    this.socket.emit('markRead',{senderId:sender,recipientId:recipient});
  }
  
  onReadRecipt() {
    return this.socket.fromEvent(this.sender_id+'read');
  }
}
