import {Component, Input} from '@angular/core'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'insufficient-balance-modal',
  templateUrl: './insufficient-balance-modal.component.html',
  styleUrls: ['./insufficient-balance-modal.component.scss']
})
export class InsufficientBalanceModalComponent {
  @Input() address

  constructor(public activeModal: NgbActiveModal) {}
}
