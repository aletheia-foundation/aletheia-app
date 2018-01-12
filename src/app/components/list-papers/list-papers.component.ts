import { Component, OnInit } from '@angular/core';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {ErrorHandlerService} from '../../providers/error-handler/error-handler.service'

@Component({
  selector: 'app-list-papers',
  templateUrl: './list-papers.component.html',
  styleUrls: ['./list-papers.component.scss']
})
export class ListPapersComponent implements OnInit {
  manuscripts: any[] = []

  constructor(private web3Client: Web3ClientService, private errorHandler: ErrorHandlerService) {

  }

  ngOnInit() {
    this.web3Client.getAllManuscripts()
    .then((manuscripts) => {
      this.manuscripts = manuscripts
    }).catch((error) => {
      this.manuscripts = []
      this.errorHandler.handleError(error, "Unable to load manuscripts")
    })
  }

}
