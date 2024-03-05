import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedEventsComponent } from './applied-events.component';

describe('AppliedEventsComponent', () => {
  let component: AppliedEventsComponent;
  let fixture: ComponentFixture<AppliedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppliedEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppliedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
