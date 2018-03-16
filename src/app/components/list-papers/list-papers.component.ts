import { Component, OnInit } from '@angular/core';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {ErrorHandlerService} from '../../providers/error-handler/error-handler.service'
import {ManuscriptViewModel} from './ManuscriptViewModel'

@Component({
  selector: 'app-list-papers',
  templateUrl: './list-papers.component.html',
  styleUrls: ['./list-papers.component.scss']
})
export class ListPapersComponent implements OnInit {
  manuscripts: ManuscriptViewModel[] = []

  constructor(private web3Client: Web3ClientService, private errorHandler: ErrorHandlerService) {

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
