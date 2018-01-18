import { Component, OnInit } from '@angular/core';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {InsufficientBalanceModalComponent} from './insufficient-balance-modal/insufficient-balance-modal.component'
import {ElectronService} from '../../providers/electron.service'
import {ErrorHandlerService} from '../../providers/error-handler/error-handler.service'
import {IpfsClientService} from '../../providers/ipfs/ipfs-client/ipfs-client.service'
import {NotificationsService} from 'angular2-notifications'

@Component({
  selector: 'app-submit-paper',
  templateUrl: './submit-paper.component.html',
  styleUrls: ['./submit-paper.component.scss']
})
export class SubmitPaperComponent{
  uploadingPaper = false

  constructor(private web3Client: Web3ClientService,
              private web3Monitor: Web3MonitorService,
              private modalService: NgbModal,
              private electronService: ElectronService,
              private errorHandler: ErrorHandlerService,
              private ipfsClient: IpfsClientService,
              private notificationService: NotificationsService
  ) {
  }

  hasInsufficientBalance () {
    const balance = this.web3Monitor.networkStatus.getValue().balance
    return !balance || balance <= 0;
  }

  showTopUpMessage() {
    this.modalService.open(InsufficientBalanceModalComponent);
  }

  shareFileButtonClick() {
    if (this.hasInsufficientBalance()) {
      return this.showTopUpMessage()
    }
    if (!this.electronService.isElectron()) {
      return this.errorHandler.handleError(new Error('File open dialog is only available in electron'))
    }

    const filePath = this.electronService.dialog.showOpenDialog({properties: ['openFile']})

    if (typeof filePath !== 'object') {
      // assume user cancelled the dialog, no action required.
      return
    }
    if (!filePath[0]) {
      return this.errorHandler.handleWarning(new Error(`No file was selected`))
    }
    const fileName = filePath[0].match(/[^/]+$/)
    if (!fileName) {
      // user did something strange in the dialog
      return this.errorHandler.handleError(new Error(`Unable to upload file or folder: ${filePath}`))
    }
    console.log(fileName)
    this.submitManuscript(fileName[0], filePath[0])
  }

  submitManuscript(fileName: string, filePath: string) {
    console.log('submit manuscript')
    this.ipfsClient.addFileFromPath(fileName, filePath)
    .then((ipfsFileRef) => {
      if (typeof ipfsFileRef !== 'object' || !ipfsFileRef[0] || !ipfsFileRef[0].hash) {
        console.log('ipfsFileRef: ', ipfsFileRef);
        throw new Error('ipfsFileRef[0].hash was null')
      }
      this.uploadingPaper = true
      return this.web3Client.indexNewFile(ipfsFileRef[0].hash)
    }).then((transactionHash) => {
      return this.web3Client.awaitTransaction(transactionHash)
    }).then((blockHash) => {
      // will probably have to poll for inclusion in the blockchain =(
      if (typeof blockHash !== 'string') {
        console.log('blockHash: ', blockHash)
        throw new Error('hash of ethereum block was invalid')
      }
      this.notificationService.success(
        'Paper submitted successfully:',
        'The paper will be voted on before being stored permanently on the Aletheia network'
      )
      this.uploadingPaper = false
    }).catch((err) => {
      this.uploadingPaper = false
      this.errorHandler.handleError(err, `Unable to share file: ${fileName}`)
    })
  }
}
