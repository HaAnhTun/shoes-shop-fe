import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountShoesComponent } from './discount-shoes.component';

describe('DiscountShoesComponent', () => {
  let component: DiscountShoesComponent;
  let fixture: ComponentFixture<DiscountShoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountShoesComponent]
    });
    fixture = TestBed.createComponent(DiscountShoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
