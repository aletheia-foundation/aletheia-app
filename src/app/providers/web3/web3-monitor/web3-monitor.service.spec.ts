import { TestBed, inject } from '@angular/core/testing';

import { Web3MonitorService } from './web3-monitor.service';
import {POLL_INTERVAL_MS} from '../../../Injection-tokens'
import {web3Factory} from '../web3/web3.factory'
import {Web3Provider} from '../web3-provider/web3-provider.token'
import {Web3Token} from '../web3/web3.token'

function fakeWeb3ProviderFactory () {
  return new FakeWeb3Provider()
}

describe('Web3MonitorService', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {provide: Web3Provider, useFactory: fakeWeb3ProviderFactory},
        {provide: Web3Token, deps: [Web3Provider], useFactory: web3Factory},
        {provide: POLL_INTERVAL_MS, useValue: ''},
        Web3MonitorService
      ]
    })
  })

  it('should be created', inject([Web3MonitorService], (service: Web3MonitorService) => {
    expect(service).toBeTruthy()
  }))
})
