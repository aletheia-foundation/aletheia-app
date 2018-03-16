import { TestBed, inject } from '@angular/core/testing';

import { Web3ClientService } from './web3-client.service';
import {Web3HelperService} from '../web3-helper/web3-helper.service'
import {POLL_INTERVAL_MS} from '../../../Injection-tokens'
import {web3Factory} from '../web3/web3.factory'
import * as FakeWeb3Provider from 'web3-fake-provider'
import {Web3Provider} from '../web3-provider/web3-provider.token'
import {Web3Token} from '../web3/web3.token'
import {ContractLoaderService, MockContractLoaderService} from '../../contracts/contract-loader.service'
import {MockWeb3AccountService, Web3AccountService} from '../web3-account/web3-account.service'

function fakeWeb3ProviderFactory () {
  return new FakeWeb3Provider()
}

describe('Web3ClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Web3Provider, useFactory: fakeWeb3ProviderFactory},
        Web3HelperService,
        {provide: Web3Token, deps: [Web3Provider], useFactory: web3Factory},
        {provide: ContractLoaderService, useClass: MockContractLoaderService},
        {provide: Web3AccountService, useClass: MockWeb3AccountService},
        {provide: POLL_INTERVAL_MS, useValue: ''},
        Web3ClientService
      ]
    });
  });

  it('should be created', inject([Web3ClientService], (service: Web3ClientService) => {
    expect(service).toBeTruthy();
  }));
});
