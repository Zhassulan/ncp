import { TestBed } from '@angular/core/testing';

import { HiddenPaymentsService } from './hidden-payments.service';

describe('HiddenPaymentsService', () => {
  let service: HiddenPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiddenPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
