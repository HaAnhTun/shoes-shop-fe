import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackManagComponent } from './feedback-manag.component';

describe('FeedbackManagComponent', () => {
  let component: FeedbackManagComponent;
  let fixture: ComponentFixture<FeedbackManagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackManagComponent]
    });
    fixture = TestBed.createComponent(FeedbackManagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
