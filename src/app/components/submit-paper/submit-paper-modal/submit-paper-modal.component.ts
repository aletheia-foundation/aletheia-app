import {Component, OnInit} from '@angular/core'
import {ElectronService} from '../../../providers/electron.service'
import {ErrorHandlerService} from '../../../providers/error-handler/error-handler.service'
import {Web3ClientService} from '../../../providers/web3/web3-client/web3-client.service'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import {IpfsClientService} from '../../../providers/ipfs/ipfs-client/ipfs-client.service'
import {NotificationsService} from 'angular2-notifications'

@Component({
  selector: 'app-submit-paper-modal',
  templateUrl: './submit-paper-modal.component.html',
  styleUrls: ['./submit-paper-modal.component.scss']
})
export class SubmitPaperModalComponent implements OnInit {
  fileName = ''
  filePath = ''
  title = ''
  isAuthor = false
  uploadingPaper = false
  constructor(
    private web3Client: Web3ClientService,
    private activeModal: NgbActiveModal,
    private electronService: ElectronService,
    private errorHandler: ErrorHandlerService,
    private ipfsClient: IpfsClientService,
    private notificationService: NotificationsService
  ) {
  }

  ngOnInit() {
  }

  shareFileButtonClick() {
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
    if (!/\.pdf$/.test(fileName[0])) {
      return this.errorHandler.handleError(new Error(`Currently only pdf files can be uploaded`))
    }
    this.fileName = fileName[0]
    this.filePath = filePath[0]
  }

  onSubmitPaper() {
    this.ipfsClient.addFileFromPath(this.fileName, this.filePath)
    .then((ipfsFileRef) => {
      if (typeof ipfsFileRef !== 'object' || !ipfsFileRef[0] || !ipfsFileRef[0].hash) {
        console.log('ipfsFileRef: ', ipfsFileRef);
        throw new Error('ipfsFileRef[0].hash was null')
      }
      this.uploadingPaper = true
      return this.web3Client.submitManuscript(ipfsFileRef[0].hash, this.title, this.isAuthor)
    }).then((minimalManuscriptContract) => {
      if (!minimalManuscriptContract.address) {
        console.log('minimalManuscriptContract: ', minimalManuscriptContract)
        throw new Error('The manuscript contract returned had no address')
      }
      this.uploadingPaper = false
      this.notificationService.success(
        'Paper submitted successfully:',
        'The paper will be voted on before being stored permanently on the Aletheia network'
      )
      this.activeModal.close()

    }).catch((err) => {
      this.uploadingPaper = false
      this.errorHandler.handleError(err, `Unable to share file: ${this.fileName}`)
    })
  }
}
