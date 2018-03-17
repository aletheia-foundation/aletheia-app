import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing'

import { SubmitPaperComponent } from './submit-paper.component'
import {Web3NetworkStatus} from '../../providers/web3/web3-monitor/web3-network-status'
import {MockWeb3MonitorService, Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {InsufficientBalanceModalComponent} from './insufficient-balance-modal/insufficient-balance-modal.component'
import {SubmitPaperModalComponent} from './submit-paper-modal/submit-paper-modal.component'

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

describe('SubmitPaperComponent', () => {
  let component: SubmitPaperComponent
  let fixture: ComponentFixture<SubmitPaperComponent>
  let compiled: any
  const mockWeb3Monitor = new MockWeb3MonitorService()
  const mockNgbModal = new MockNgbModal()

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [ SubmitPaperComponent ],
      providers: [
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
      spyOn(mockNgbModal, 'open')
      mockWeb3Monitor.networkStatus.next(new Web3NetworkStatus(null, 0, '0xTESTADDRESS', 0))
      compiled.querySelector('.submit-paper-button').click()
      fixture.detectChanges()
    })
    it('should show a modal to top up account', () => {
      expect(mockNgbModal.open).toHaveBeenCalledWith(InsufficientBalanceModalComponent)
    })
  })
  describe('Clicking on button when balance is not zero', () => {
    beforeEach(() => {
      spyOn(mockNgbModal, 'open')
      mockWeb3Monitor.networkStatus.next(new Web3NetworkStatus(null, 0, '0xTESTADDRESS', 1000000))
      compiled.querySelector('.submit-paper-button').click()
      fixture.detectChanges()
    })
    it('should show a modal to upload a file', () => {
      expect(mockNgbModal.open).toHaveBeenCalledWith(SubmitPaperModalComponent)
    })
  })
})
