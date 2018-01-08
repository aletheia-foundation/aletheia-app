import { Component, OnInit } from '@angular/core';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {InsufficientBalanceModalComponent} from './insufficient-balance-modal/insufficient-balance-modal.component'
import {ElectronService} from '../../providers/electron.service'
import {ErrorHandlerService} from '../../providers/error-handler/error-handler.service'

@Component({
  selector: 'app-submit-paper',
  templateUrl: './submit-paper.component.html',
  styleUrls: ['./submit-paper.component.scss']
})
export class SubmitPaperComponent implements OnInit {

  constructor(private web3Client: Web3ClientService,
              private web3Monitor: Web3MonitorService,
              private modalService: NgbModal,
              private electronService: ElectronService,
              private errorHandler: ErrorHandlerService
  ) {
  }

  hasInsufficientBalance () {
    let balance = this.web3Monitor.networkStatus.getValue().balance
    return !balance || balance <= 0;
  }

  showTopUpMessage() {
    const modalRef = this.modalService.open(InsufficientBalanceModalComponent);
    console.log('address', this.web3Monitor.networkStatus.getValue().address)
    modalRef.componentInstance.address = this.web3Monitor.networkStatus.getValue().address
  }

  shareFileButtonClick() {
    if (this.hasInsufficientBalance()) {
      return this.showTopUpMessage()
    }
    if(!this.electronService.isElectron()){
      return this.errorHandler.handleError(new Error('File open dialog is only available in electron'))
    }
    const filePath = this.electronService.electron.dialog.showOpenDialog({properties: ['openFile']})


    // if (typeof filePath !== 'object' || !filePath[0]) {
    //   this._view.showError(`Cannot read file: ${filePath}`)
    //   return
    // }
    // const fileName = filePath[0].match(/[^/]+$/)
    //
    // // todo, prevent denial of service here: https://github.com/aletheia-foundation/aletheia-app/issues/43
    // ipfsClient.addFileFromPath({
    //   fileName,
    //   filePath: filePath[0]
    // }).then((result) => {
    //   if (typeof result !== 'object' || !result[0] || !result[0].hash) {
    //     throw {err: 'result[0].hash was null', result }
    //   }
    //
    //   return this._web3Client.indexNewFile(result[0].hash).then((transactionHash) => {
    //     this._view.showUploadInProgress({transactionHash})
    //     return this._web3Client.awaitTransaction(transactionHash)
    //   }).then((blockHash) => {
    //     // will probably have to poll for inclusion in the blockchain =(
    //     if (typeof blockHash !== 'string') {
    //       throw { err: 'hash of ethereum block was invalid', blockHash }
    //     }
    //     this._view.showUploadSucces({
    //       hash: result[0].hash,
    //       path: result[0].path
    //     })
    //   })
    // }).catch((err) => {
    //   console.error(err, err.stack)
    //   this._view.showUploadError({path: fileName})
    // })

  }

  ngOnInit() {

  }

}
