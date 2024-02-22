// testimonial-slider.component.ts
import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-testimonial-slider',
  templateUrl: './testimonial-slider.component.html',
  styleUrls: ['./testimonial-slider.component.scss'],
})
export class TestimonialSliderComponent implements OnInit {
  private swiper: Swiper;

  ngOnInit() {
    this.initSwiper();
  }

  private initSwiper() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 2,
      spaceBetween: 30,
      navigation: {
        nextEl: '.testi-next',
        prevEl: '.testi-prev',
      },
      pagination: false,
      loop: true
    });
  }
}
