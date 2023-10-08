import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesCategoryComponent } from './shoes-category.component';

describe('ShoesCategoryComponent', () => {
  let component: ShoesCategoryComponent;
  let fixture: ComponentFixture<ShoesCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoesCategoryComponent]
    });
    fixture = TestBed.createComponent(ShoesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
