import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing'

import { SubmitPaperComponent } from './submit-paper.component'
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Web3NetworkStatus} from '../../providers/web3/web3-monitor/web3-network-status'
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {InsufficientBalanceModalComponent} from './insufficient-balance-modal/insufficient-balance-modal.component'
import {ElectronService} from '../../providers/electron.service'
import {ErrorHandlerService} from '../../providers/error-handler/error-handler.service'
import {IpfsClientService} from '../../providers/ipfs/ipfs-client/ipfs-client.service'
import {NotificationsService} from 'angular2-notifications'

class MockWeb3ClientService {
  indexNewFile() {}
  awaitTransaction() {}
}

class MockWeb3MonitorService {
  public networkStatus: BehaviorSubject<Web3NetworkStatus> = new BehaviorSubject(new Web3NetworkStatus(null, 0, '', 0))
}

class MockNgbModal {
  public component = {
    componentInstance: {
      address: ''
    }
  };
  public open() {
    return this.component
  }
}
class MockErrorHandlerService {
  handleError (error: Error) {}
}

class MockIpfsClientService {
  addFileFromPath () {}
}

class MockElectronService {
  public dialog = {
    showOpenDialog: () => {}
  }
  isElectron() {
    return true
  }
}

class MockNotificationService {
  success () {}
  error () {}
}

describe('SubmitPaperComponent', () => {
  let component: SubmitPaperComponent
  let fixture: ComponentFixture<SubmitPaperComponent>
  let mockWeb3Monitor = new MockWeb3MonitorService()
  let mockWeb3Client = new MockWeb3ClientService()
  let mockNgbModal = new MockNgbModal()
  let compiled: any
  let mockElectronService = new MockElectronService()
  let mockIpfsClientService = new MockIpfsClientService()
  let mockNotificationService = new MockNotificationService()
  let mockErrorHandlerService = new MockErrorHandlerService()
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [ SubmitPaperComponent ],
      providers: [
        {provide: ElectronService, useValue: mockElectronService},
        {provide: NotificationsService, useValue: mockNotificationService},
        {provide: ErrorHandlerService, useValue: mockErrorHandlerService},
        {provide: IpfsClientService, useValue: mockIpfsClientService},
        {provide: Web3ClientService, useValue: mockWeb3Client},
        {provide: Web3MonitorService, useValue: mockWeb3Monitor},
        {provide: NgbModal, useValue: mockNgbModal }
      ]

    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPaperComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('Clicking on button when balance is zero', () => {
    beforeEach(() => {
      mockWeb3Monitor.networkStatus.next(new Web3NetworkStatus(null, 0, '0xTESTADDRESS', 0))
      compiled.querySelector('.submit-paper-button').click()
      fixture.detectChanges()
    })
    it('should show a modal popup with address of the user', () => {
      expect(mockNgbModal.component.componentInstance.address).toEqual('0xTESTADDRESS')
    })
  })

  describe('choosing a directory', () => {
    beforeEach(() => {
      mockWeb3Monitor.networkStatus.next(new Web3NetworkStatus(null, 0, '0xTESTADDRESS', 100000))
      spyOn(mockElectronService.dialog, 'showOpenDialog').and.returnValue(['/'])
      spyOn(mockErrorHandlerService, 'handleError')

      compiled.querySelector('.submit-paper-button').click()
      fixture.detectChanges()
    })
    it('should show an error', () => {
      expect(mockErrorHandlerService.handleError).toHaveBeenCalled()
    })
  })

  describe('Choosing a file', () => {
    beforeEach(() => {
      mockWeb3Monitor.networkStatus.next(new Web3NetworkStatus(null, 0, '0xTESTADDRESS', 100000))
      spyOn(mockElectronService.dialog, 'showOpenDialog').and.returnValue(['/home/kevin/Documents/manuscript.pdf'])
      spyOn(component, 'submitManuscript').and.stub()
      compiled.querySelector('.submit-paper-button').click()

      fixture.detectChanges()
    })
    it('should call the submitManuscript function', () => {
      expect(component.submitManuscript).toHaveBeenCalledWith('manuscript.pdf', '/home/kevin/Documents/manuscript.pdf')
    })
  })

  describe('Clicking button and choosing a file: Success', () => {
    // fakeAsync is needed so that promises can be resolved before calling the `it` block
    // https://angular-2-training-book.rangle.io/handout/testing/components/async.html
    beforeEach(fakeAsync(() => {
      spyOn(mockIpfsClientService, 'addFileFromPath').and.returnValue(Promise.resolve(
        {
          0: {
            hash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
          }
        }
      ))
      spyOn(mockWeb3Client, 'indexNewFile').and.returnValue(Promise.resolve(
      '0x90696942e1da6cf23d9c25bfe6d5d65237468fbbbb9beb0c1cf8940358ab031c'
      ))
      spyOn(mockWeb3Client, 'awaitTransaction').and.returnValue(Promise.resolve(
        '0xcc424a6b7ae83b593685d26152b6e94983a8ad506d3740202029349e13009efb'
      ))
      spyOn(mockNotificationService, 'success')
      spyOn(mockErrorHandlerService, 'handleError')
      component.submitManuscript('manuscript.pdf', '/home/kevin/Documents/manuscript.pdf')
      // tick allows promises returned by spys to resolve before running the `it` block
      tick()
      fixture.detectChanges()
    }))
    it('should upload the file successfully', () => {
      expect(mockIpfsClientService.addFileFromPath).toHaveBeenCalled()
      expect(mockWeb3Client.indexNewFile).toHaveBeenCalled()
      expect(mockWeb3Client.awaitTransaction).toHaveBeenCalled()
      expect(mockNotificationService.success).toHaveBeenCalled()
      expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled()
    })
  })
})
