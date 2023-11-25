import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayFaileComponent } from './pay-faile.component';

describe('PayFaileComponent', () => {
  let component: PayFaileComponent;
  let fixture: ComponentFixture<PayFaileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayFaileComponent]
    });
    fixture = TestBed.createComponent(PayFaileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
