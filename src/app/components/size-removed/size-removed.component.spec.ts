import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeRemovedComponent } from './size-removed.component';

describe('SizeRemovedComponent', () => {
  let component: SizeRemovedComponent;
  let fixture: ComponentFixture<SizeRemovedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SizeRemovedComponent]
    });
    fixture = TestBed.createComponent(SizeRemovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
