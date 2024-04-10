import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    selectedId = new BehaviorSubject<string | null>(null);
    unshiftUser = new BehaviorSubject<string | null>(null);

    selectedChatId:string = '';

    setSelectedChatId(id:string) {
        this.selectedChatId = id;
    }
}