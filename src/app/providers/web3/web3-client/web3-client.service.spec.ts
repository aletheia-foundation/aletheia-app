import { TestBed, inject } from '@angular/core/testing';

import { Web3ClientService } from './web3-client.service';

describe('Web3ClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3ClientService]
    });
  });

  it('should be created', inject([Web3ClientService], (service: Web3ClientService) => {
    expect(service).toBeTruthy();
  }));
});
