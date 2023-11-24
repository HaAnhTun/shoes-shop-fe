import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySuccessComponent } from './pay-success.component';

describe('PaySuccessComponent', () => {
  let component: PaySuccessComponent;
  let fixture: ComponentFixture<PaySuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaySuccessComponent]
    });
    fixture = TestBed.createComponent(PaySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
