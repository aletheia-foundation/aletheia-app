import { TestBed, inject } from '@angular/core/testing';

import { Web3HelperService } from './web3-helper.service';

describe('Web3HelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3HelperService]
    });
  });

  it('should be created', inject([Web3HelperService], (service: Web3HelperService) => {
    expect(service).toBeTruthy();
  }));
});
