import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesInspectComponent } from './shoes-inspect.component';

describe('ShoesInspectComponent', () => {
  let component: ShoesInspectComponent;
  let fixture: ComponentFixture<ShoesInspectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoesInspectComponent]
    });
    fixture = TestBed.createComponent(ShoesInspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
