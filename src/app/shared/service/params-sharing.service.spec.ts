import { TestBed } from '@angular/core/testing';

import { ParamsSharingService } from './params-sharing.service';

describe('ParamsSharingService', () => {
  let service: ParamsSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParamsSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
