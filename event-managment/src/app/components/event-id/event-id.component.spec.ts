import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventIdComponent } from './event-id.component';

describe('EventIdComponent', () => {
  let component: EventIdComponent;
  let fixture: ComponentFixture<EventIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
