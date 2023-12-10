import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorRemovedComponent } from './color-removed.component';

describe('ColorRemovedComponent', () => {
  let component: ColorRemovedComponent;
  let fixture: ComponentFixture<ColorRemovedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorRemovedComponent]
    });
    fixture = TestBed.createComponent(ColorRemovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
