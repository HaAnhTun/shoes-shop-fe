import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommmonTemplateComponent } from './commmon-template.component';

describe('CommmonTemplateComponent', () => {
  let component: CommmonTemplateComponent;
  let fixture: ComponentFixture<CommmonTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommmonTemplateComponent]
    });
    fixture = TestBed.createComponent(CommmonTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
