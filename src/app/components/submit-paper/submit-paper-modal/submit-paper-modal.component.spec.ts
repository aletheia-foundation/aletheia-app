import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing'

import { SubmitPaperModalComponent } from './submit-paper-modal.component'
import {ElectronService, MockElectronService} from '../../../providers/electron.service'
import {NotificationsService} from 'angular2-notifications'
import {ErrorHandlerService, MockErrorHandlerService} from '../../../providers/error-handler/error-handler.service'
import {IpfsClientService, MockIpfsClientService} from '../../../providers/ipfs/ipfs-client/ipfs-client.service'
import {MockWeb3ClientService, Web3ClientService} from '../../../providers/web3/web3-client/web3-client.service'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'

class MockNotificationService {
  success () {}
  error () {}
}

describe('SubmitPaperModalComponent', () => {
  let component: SubmitPaperModalComponent
  let fixture: ComponentFixture<SubmitPaperModalComponent>
  let compiled: any
  const mockWeb3Client = new MockWeb3ClientService()
  const mockElectronService = new MockElectronService()
  const mockIpfsClientService = new MockIpfsClientService()
  const mockNotificationService = new MockNotificationService()
  const mockErrorHandlerService = new MockErrorHandlerService()
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPaperModalComponent ],
      providers: [
        NgbActiveModal,
        {provide: ElectronService, useValue: mockElectronService},
        {provide: NotificationsService, useValue: mockNotificationService},
        {provide: ErrorHandlerService, useValue: mockErrorHandlerService},
        {provide: IpfsClientService, useValue: mockIpfsClientService},
        {provide: Web3ClientService, useValue: mockWeb3Client},
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPaperModalComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement

    fixture.detectChanges()
  })


  describe('choosing a directory', () => {
    beforeEach(() => {
      spyOn(mockElectronService.dialog, 'showOpenDialog').and.returnValue(['/'])
      spyOn(mockErrorHandlerService, 'handleError')

      compiled.querySelector('.select-file-button').click()
      fixture.detectChanges()
    })
    it('should show an error', () => {
      expect(mockErrorHandlerService.handleError).toHaveBeenCalled()
    })
  })

  describe('Choosing a file', () => {
    beforeEach(() => {
      spyOn(mockElectronService.dialog, 'showOpenDialog').and.returnValue(['/home/kevin/Documents/manuscript.pdf'])
      compiled.querySelector('.select-file-button').click()

      fixture.detectChanges()
    })
    it('should display the filename in the ui', () => {
      expect(compiled.querySelector('.upload-paper-filename').innerText).toContain('manuscript.pdf')
    })
  })

  describe('Submit a manuscript: Success', () => {
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
      spyOn(mockWeb3Client, 'submitManuscript').and.returnValue(Promise.resolve({
        address: '0x90696942e1da6cf23d9c25bfe6d5d65237468fbbbb9beb0c1cf8940358ab031c'
      }))
      spyOn(mockNotificationService, 'success')
      spyOn(mockErrorHandlerService, 'handleError')
      component.paperForm = {
        invalid: false
      }
      component.onSubmitPaper()
      // tick allows promises returned by spys to resolve before running the `it` block
      tick()
      fixture.detectChanges()
    }))

    it('should upload the file successfully', () => {
      expect(mockIpfsClientService.addFileFromPath).toHaveBeenCalled()
      expect(mockWeb3Client.submitManuscript).toHaveBeenCalled()
      expect(mockNotificationService.success).toHaveBeenCalled()
      expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled()
    })
  })
})
