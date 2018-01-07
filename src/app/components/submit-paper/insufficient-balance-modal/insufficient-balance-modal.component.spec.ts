import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InsufficientBalanceModalComponent } from './insufficient-balance-modal.component'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'

describe('InsufficientBalanceModalComponent', () => {
  let component: InsufficientBalanceModalComponent
  let fixture: ComponentFixture<InsufficientBalanceModalComponent>
  let compiled: any

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsufficientBalanceModalComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InsufficientBalanceModalComponent)
    component = fixture.componentInstance
    component.address = '0xTESTADDRESS'
    compiled = fixture.debugElement.nativeElement
    fixture.detectChanges()
  })

  it('should include a link with the address of the user', () => {
    expect(compiled.querySelector('.aletheia-faucet-link').href).toContain('0xTESTADDRESS')

  })
})
