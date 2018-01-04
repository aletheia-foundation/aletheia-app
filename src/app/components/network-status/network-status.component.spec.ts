import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkStatusComponent } from './network-status.component';
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {EventEmitter} from 'events'
import {Web3NetworkStatus} from '../../providers/web3/web3-monitor/web3-network-status'

class MockWeb3MonitorService extends EventEmitter {

}

describe('NetworkStatusComponent', () => {
  let component: NetworkStatusComponent
  let fixture: ComponentFixture<NetworkStatusComponent>
  let mockWeb3Monitor = new MockWeb3MonitorService()
  let compiled: any

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Web3MonitorService, useValue: mockWeb3Monitor}
      ],
      declarations: [ NetworkStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkStatusComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when 10 peers are connected', () => {
    beforeEach(() => {
      mockWeb3Monitor.emit('network-update', null, new Web3NetworkStatus(10, '0x12345', 200))
      fixture.detectChanges()
    })
    it('should show the network status as connected', () => {
      expect(compiled.querySelector('.connected-status')).not.toBe(null)
      expect(compiled.querySelector('.peers-connected').innerText).toContain('10')
      expect(compiled.querySelector('.balance').innerText).toContain('200')
    })
  })

  describe('when 0 peers are connected', () => {
    beforeEach(() => {
      mockWeb3Monitor.emit('network-update', null, new Web3NetworkStatus(0, '0x12345', 300))
      fixture.detectChanges()
    })
    it('should show the network status as warning', () => {
      expect(compiled.querySelector('.connected-status')).toBe(null)
      expect(compiled.querySelector('.warning-status')).not.toBe(null)
      expect(compiled.querySelector('.peers-connected').innerText).toContain('0')
      expect(compiled.querySelector('.balance').innerText).toContain('300')
    })
  })

  describe('when the local node cannot be reached', () => {

    beforeEach(() => {
      mockWeb3Monitor.emit('network-update',  new Error('Unable to find blockchain address'), null)
      fixture.detectChanges()
    })
    it('should show the network status as error', () => {
      expect(compiled.querySelector('.error-status')).not.toBe(null)
      expect(compiled.querySelector('.peers-connected')).toBe(null)
      expect(compiled.querySelector('.profile-link')).toBe(null)
      expect(compiled.querySelector('.balance')).toBe(null)
    })
  })
});
