import { Component, OnInit } from '@angular/core';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'

@Component({
  selector: 'app-submit-paper',
  templateUrl: './submit-paper.component.html',
  styleUrls: ['./submit-paper.component.scss']
})
export class SubmitPaperComponent implements OnInit {

  constructor(web3Client: Web3ClientService) {

  console.log('web3 all loaded!', web3Client)
  }

  ngOnInit() {

  }

}
