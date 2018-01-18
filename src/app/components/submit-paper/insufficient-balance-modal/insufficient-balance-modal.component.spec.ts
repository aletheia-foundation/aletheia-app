import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InsufficientBalanceModalComponent } from './insufficient-balance-modal.component'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {Config} from '../../../../../config/Config'
import {NotificationsService} from 'angular2-notifications'
import {ErrorHandlerService} from '../../../providers/error-handler/error-handler.service'
import {Web3AccountService} from '../../../providers/web3/web3-account/web3-account.service'
import {Web3ClientService} from '../../../providers/web3/web3-client/web3-client.service'
import {HttpClientModule} from '@angular/common/http'

describe('InsufficientBalanceModalComponent', () => {
  let component: InsufficientBalanceModalComponent
  let fixture: ComponentFixture<InsufficientBalanceModalComponent>
  let compiled: any

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsufficientBalanceModalComponent ],
      providers: [
        NgbActiveModal,
        Config,
        NotificationsService,
        ErrorHandlerService,
        Web3AccountService,
        Web3ClientService
      ],
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InsufficientBalanceModalComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement
    fixture.detectChanges()
  })

  it('should load the captcha image', () => {
    expect(compiled.querySelector('#captcha-img').src).toContain('captcha')
  })
})
