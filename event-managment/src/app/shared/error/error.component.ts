import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  @Input() control:any;
  @Input() controlErr:string;
  @Input() errorMsg:string = '';
  @Input() touched?:boolean = true;
}
