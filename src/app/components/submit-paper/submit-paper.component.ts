import { Component } from '@angular/core';
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {InsufficientBalanceModalComponent} from './insufficient-balance-modal/insufficient-balance-modal.component'
import {SubmitPaperModalComponent} from './submit-paper-modal/submit-paper-modal.component'

@Component({
  selector: 'app-submit-paper',
  templateUrl: './submit-paper.component.html',
  styleUrls: ['./submit-paper.component.scss']
})
export class SubmitPaperComponent {

  constructor(
              private web3Monitor: Web3MonitorService,
              private modalService: NgbModal,
  ) {
  }

  hasInsufficientBalance () {
    const balance = this.web3Monitor.networkStatus.getValue().balance
    return !balance || balance <= 0;
  }

  showTopUpModal() {
    this.modalService.open(InsufficientBalanceModalComponent);
  }

  showSubmitPaperModal() {
    this.modalService.open(SubmitPaperModalComponent);
  }

  submitPaperButtonClick() {
    if (this.hasInsufficientBalance()) {
      return this.showTopUpModal()
    }
    return this.showSubmitPaperModal()
  }
}
