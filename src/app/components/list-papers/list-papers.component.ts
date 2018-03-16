import { Component, OnInit } from '@angular/core';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {ErrorHandlerService} from '../../providers/error-handler/error-handler.service'
import {ManuscriptViewModel} from './ManuscriptViewModel'
import {IpfsClientService} from '../../providers/ipfs/ipfs-client/ipfs-client.service'
import {ElectronService} from '../../providers/electron.service'
import {FileHelper} from '../../providers/file-helper/file-helper'
@Component({
  selector: 'app-list-papers',
  templateUrl: './list-papers.component.html',
  styleUrls: ['./list-papers.component.scss']
})
export class ListPapersComponent implements OnInit {
  manuscripts: ManuscriptViewModel[] = []
  downloading = false
  constructor(private web3Client: Web3ClientService,
              private errorHandler: ErrorHandlerService,
              private ipfsClient: IpfsClientService,
              private electronService: ElectronService
  ) {

  }

  async downloadManuscript(_hash, title) {
    this.downloading = true
    try {
      const stream = await this.ipfsClient.getStream(_hash)

      if (!this.electronService.isElectron()) {
        return this.errorHandler.handleError(new Error('File open dialog is only available in electron'))
      }
      const defaultFileName = FileHelper.toAbsoluteDownloadFilePath(title, '.pdf')

      const filePath = this.electronService.dialog.showSaveDialog({
        defaultPath: defaultFileName
      })
      if (filePath) {
        FileHelper.writeFileStream(stream, filePath)
      }
    } catch (e) {
      this.errorHandler.handleError(e, 'Error downloading paper')
    }
  }


  async ngOnInit() {
    try {
      this.manuscripts = await this.web3Client.getAllManuscripts()
    } catch (error) {
      this.manuscripts = []
      this.errorHandler.handleError(error, 'Unable to load manuscripts')
    }
  }

}
