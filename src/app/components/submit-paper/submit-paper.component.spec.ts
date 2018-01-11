import { async, ComponentFixture, TestBed } from '@angular/core/testing'

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

class MockWeb3ClientService {}

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

}

describe('SubmitPaperComponent', () => {
  let component: SubmitPaperComponent
  let fixture: ComponentFixture<SubmitPaperComponent>
  let mockWeb3Monitor = new MockWeb3MonitorService()
  let mockNgbModal = new MockNgbModal()
  let compiled: any

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [ SubmitPaperComponent ],
      providers: [
        ElectronService,
        {provide: ErrorHandlerService, useClass: MockErrorHandlerService},
        {provide: IpfsClientService, useClass: MockIpfsClientService},
        {provide: Web3ClientService, useClass: MockWeb3ClientService},
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
})
