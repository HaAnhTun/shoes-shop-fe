import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesDetailComponent } from './shoes-detail.component';

describe('ShoesDetailComponent', () => {
  let component: ShoesDetailComponent;
  let fixture: ComponentFixture<ShoesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoesDetailComponent]
    });
    fixture = TestBed.createComponent(ShoesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
