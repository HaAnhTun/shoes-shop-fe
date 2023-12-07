import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandRemovedComponent } from './brand-removed.component';

describe('BrandRemovedComponent', () => {
  let component: BrandRemovedComponent;
  let fixture: ComponentFixture<BrandRemovedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandRemovedComponent]
    });
    fixture = TestBed.createComponent(BrandRemovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
