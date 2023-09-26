import { TestBed } from '@angular/core/testing';

import { FudbalskitimService } from './fudbalskitim.service';

describe('FudbalskitimService', () => {
  let service: FudbalskitimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FudbalskitimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
