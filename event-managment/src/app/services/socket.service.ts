import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  connect(): void {
    this.socket.connect();
  }
  
  sendMessage(message: string, sender_id: string, recipent_id: string) {
    this.socket.emit('msg', {
      message: message,
      sender_id: sender_id,
      recipent_id: recipent_id,
    });
  }
}
