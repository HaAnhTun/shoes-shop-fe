import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesDetailAddComponent } from './shoes-detail-add.component';

describe('ShoesDetailAddComponent', () => {
  let component: ShoesDetailAddComponent;
  let fixture: ComponentFixture<ShoesDetailAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoesDetailAddComponent]
    });
    fixture = TestBed.createComponent(ShoesDetailAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
