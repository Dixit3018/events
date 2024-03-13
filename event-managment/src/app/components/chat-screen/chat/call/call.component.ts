import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// get token
function generateToken(tokenServerUrl: string, userID: string) {
  return fetch(
    `${tokenServerUrl}/access_token?userID=${userID}`,
    {
      method: 'GET',
    }
  ).then((res) => res.json());
}

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrl: './call.component.scss'
})
export class CallComponent {
  @ViewChild('root') root: ElementRef;
  roomId:string = '';

  constructor(private route:ActivatedRoute){}

  ngAfterViewInit() {
    this.route.params.subscribe((params:any) => {
      this.roomId = params['roomId'];
    })  
    
    
    const userID = JSON.parse(localStorage.getItem('user'))['_id'];
    const userName = JSON.parse(localStorage.getItem('user'))['username'];

    
    generateToken('https://nextjs-token.vercel.app/api', userID).then((res) => {
      const token = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        1484647939,
        res.token,
        this.roomId,
        userID,
        userName
      );
      const zp = ZegoUIKitPrebuilt.create(token);

      // start the call
      zp.joinRoom({
        container: this.root.nativeElement,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
              window.location.origin +
              window.location.pathname +
              '?roomID=' +
              this.roomId,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
      });
    });
  }
}
