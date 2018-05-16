import { Component, OnInit } from '@angular/core';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {ErrorHandlerService} from '../../providers/error-handler/error-handler.service'
import {ManuscriptViewModel} from './manuscript-view-model'
import {IpfsClientService} from '../../providers/ipfs/ipfs-client/ipfs-client.service'
import {ElectronService} from '../../providers/electron.service'
import {FileHelper} from '../../providers/file-helper/file-helper'
import {NotificationsService} from 'angular2-notifications'
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {ManuscriptVotingStatus} from './manuscript-voting-status'
@Component({
  selector: 'app-list-papers',
  templateUrl: './list-papers.component.html',
  styleUrls: ['./list-papers.component.scss']
})
export class ListPapersComponent implements OnInit {
  manuscripts: ManuscriptViewModel[] = []
  downloading = false
  manuscriptVotingStatus = ManuscriptVotingStatus

  constructor(private web3Client: Web3ClientService,
              private errorHandler: ErrorHandlerService,
              private web3Monitor: Web3MonitorService,
              private ipfsClient: IpfsClientService,
              private electronService: ElectronService,
              private notificationService: NotificationsService,
  ) {
  }

  async voteOnManuscript(manuscript, vote) {
    // check if voter is the one who created the manuscript
    if (manuscript.authors.indexOf(this.web3Monitor.networkStatus.getValue().address) != -1){
      this.errorHandler.handleError(new Error('You cannot vote on your own paper'))
      return
    }

    // check if voter has voted already

    try {
      const result = await this.web3Client.voteOnManuscript(manuscript.dataAddress, vote)
      const votingActive = await this.web3Client.votingActive(manuscript.dataAddress)
      if(result) {
        console.log('vote cast', result)
        this.notificationService.success('Your vote was recorded', `Voting on the paper is still open for ${votingActive} more blocks`)
      }
    } catch (e) {
      this.errorHandler.handleError(e, 'There was an error casting your vote, currently your vote cannot be changed one it has been cast')
    }
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
