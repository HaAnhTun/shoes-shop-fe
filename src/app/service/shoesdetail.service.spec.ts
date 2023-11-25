import { TestBed } from '@angular/core/testing';

import { ShoesdetailService } from './shoesdetail.service';

describe('ShoesdetailService', () => {
  let service: ShoesdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoesdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
