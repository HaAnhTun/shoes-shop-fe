import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReturnAdminComponent } from './order-return-admin.component';

describe('OrderReturnAdminComponent', () => {
  let component: OrderReturnAdminComponent;
  let fixture: ComponentFixture<OrderReturnAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderReturnAdminComponent]
    });
    fixture = TestBed.createComponent(OrderReturnAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
