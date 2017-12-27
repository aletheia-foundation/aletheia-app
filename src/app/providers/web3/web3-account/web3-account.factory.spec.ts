import { TestBed, inject } from '@angular/core/testing';

import { Web3Account.FactoryService } from './web3-account.factory.service';

describe('Web3Account.FactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Account.FactoryService]
    });
  });

  it('should be created', inject([Web3Account.FactoryService], (service: Web3Account.FactoryService) => {
    expect(service).toBeTruthy();
  }));
});
