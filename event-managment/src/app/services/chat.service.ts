import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    selectedId = new BehaviorSubject<string | null>(null);
    unReadMsg = new BehaviorSubject<{senderId:string, totalCount:number} | null>(null);
    unshiftUser = new BehaviorSubject<string | null>(null);

    selectedChatId:string = '';

    setUnReadMsg(senderId:string, count:number) {
        const previousCount = +localStorage.getItem(senderId);

        if(previousCount){
            const totalCount = +(count+previousCount);
            this.unReadMsg.next({senderId, totalCount})
            localStorage.setItem(senderId,totalCount+'');
        }
        else{
            const totalCount = 1;
            this.unReadMsg.next({senderId,totalCount})
            localStorage.setItem(senderId,totalCount+'');

        }
    }
    setSelectedChatId(id:string) {
        this.selectedChatId = id;
    }

}