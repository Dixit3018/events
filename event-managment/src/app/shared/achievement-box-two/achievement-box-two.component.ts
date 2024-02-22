// achievement-box-two.component.ts
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-achievement-box-two',
  template: `
    <div [@count]="count" class="achievement-box-two">
      <h2>
        <span class="number">{{ animatedNumber }}</span
        >+
      </h2>
      <h5>{{ title }}</h5>
    </div>
  `,
  animations: [
    trigger('count', [
      transition(':increment', [
        style({ transform: 'scale(1.2)' }),
        animate('500ms ease-out', style({ transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class AchievementBoxTwoComponent implements OnInit {
  @Input() title: string = '';
  @Input() limit: number;
  @Input() speed: number;
  count = 0;
  animatedNumber = 0;
  isVisible = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.checkVisibility();
    window.addEventListener('scroll', () => this.checkVisibility());
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', () => this.checkVisibility());
  }

  private checkVisibility() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (this.isVisible) {
      this.animateCount();
      window.removeEventListener('scroll', () => this.checkVisibility());
    }
  }

  animateCount() {
    const interval = setInterval(() => {
      if (this.count < +this.limit) {
        this.count++;
        this.animatedNumber++;
      } else {
        clearInterval(interval);
      }
    }, this.speed);
  }
}
