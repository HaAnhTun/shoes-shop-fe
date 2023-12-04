import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReturnDetailsComponent } from './order-return-details.component';

describe('OrderReturnDetailsComponent', () => {
  let component: OrderReturnDetailsComponent;
  let fixture: ComponentFixture<OrderReturnDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderReturnDetailsComponent]
    });
    fixture = TestBed.createComponent(OrderReturnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
