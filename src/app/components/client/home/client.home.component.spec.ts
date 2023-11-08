import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHomeComponent } from './client.home.component';

describe('ClientHomeComponent', () => {
  let component: ClientHomeComponent;
  let fixture: ComponentFixture<ClientHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientHomeComponent]
    });
    fixture = TestBed.createComponent(ClientHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
