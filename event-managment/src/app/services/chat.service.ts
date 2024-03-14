import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    selectedId = new BehaviorSubject<string | null>(null);

    setSelectedChatId(chatId:string) {
        this.selectedId.next(chatId);
    }

}