import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing'

import { ListPapersComponent } from './list-papers.component'
import {MockWeb3ClientService, Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {ErrorHandlerService, MockErrorHandlerService} from '../../providers/error-handler/error-handler.service'
import {IpfsClientService, MockIpfsClientService} from '../../providers/ipfs/ipfs-client/ipfs-client.service'
import {ElectronService, MockElectronService} from '../../providers/electron.service'
import {MockWeb3MonitorService, Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {NotificationsService} from 'angular2-notifications'

describe('ListPapersComponent', () => {
  let component: ListPapersComponent
  let compiled: any
  let fixture: ComponentFixture<ListPapersComponent>
  let mockWeb3Client: MockWeb3ClientService = new MockWeb3ClientService()
  let mockErrorHandler: MockErrorHandlerService = new MockErrorHandlerService()
  let mockIpfsClientService = new MockIpfsClientService()
  let mockElectronService = new MockElectronService()
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPapersComponent ],
      providers: [
        {provide: ElectronService, useValue: mockElectronService},
        {provide: IpfsClientService, useValue: mockIpfsClientService},
        {provide: Web3ClientService, useValue: mockWeb3Client},
        {provide: ErrorHandlerService, useValue: mockErrorHandler},
        {provide: Web3MonitorService, useValue: new MockWeb3MonitorService()},
        {provide: NotificationsService, useValue: new NotificationsService({})}
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(ListPapersComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement
  }))

  describe('if no manuscripts are found', () => {
    beforeEach(fakeAsync(() => {
      spyOn(mockWeb3Client, 'getAllManuscripts').and.returnValue(Promise.reject(new Error("test_error")))
      spyOn(mockErrorHandler, 'handleError')
      component.ngOnInit()
      tick()
      fixture.detectChanges()
    }))
    it('should show an empty state and error', () => {
      expect(compiled.querySelector('.no-manuscripts-message')).not.toBe(null)
      expect(mockErrorHandler.handleError).toHaveBeenCalled()
    })
  })

  describe('if manuscripts are found', () => {
    beforeEach(fakeAsync(() => {
      spyOn(mockWeb3Client, 'getAllManuscripts').and.returnValue(Promise.resolve([
        {
          dataAddress: '0x12345678',
          contractAddress: '0x1234567891011',
          title: 'testing methods for angular apps'
        }
      ]))
      spyOn(mockErrorHandler, 'handleError')
      component.ngOnInit()
      tick()
      fixture.detectChanges()
    }))
    it('should show the papers', () => {
      expect(compiled.querySelector('.manuscript-item').innerText).toContain('testing methods for angular apps')
      expect(compiled.querySelector('.no-manuscripts-message')).toBe(null)
      expect(mockErrorHandler.handleError).not.toHaveBeenCalled()
    })
  })
})
