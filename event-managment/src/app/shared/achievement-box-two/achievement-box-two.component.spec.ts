import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementBoxTwoComponent } from './achievement-box-two.component';

describe('AchievementBoxTwoComponent', () => {
  let component: AchievementBoxTwoComponent;
  let fixture: ComponentFixture<AchievementBoxTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchievementBoxTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AchievementBoxTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
