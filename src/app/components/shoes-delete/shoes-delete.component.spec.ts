import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesDeleteComponent } from './shoes-delete.component';

describe('ShoesDeleteComponent', () => {
  let component: ShoesDeleteComponent;
  let fixture: ComponentFixture<ShoesDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoesDeleteComponent]
    });
    fixture = TestBed.createComponent(ShoesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
