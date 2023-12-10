import { TestBed } from '@angular/core/testing';

import { ReturnOrderService } from './return-order.service';

describe('ReturnOrderService', () => {
  let service: ReturnOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
