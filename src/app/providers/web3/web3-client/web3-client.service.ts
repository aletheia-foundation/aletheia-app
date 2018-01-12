import { Injectable, Inject } from '@angular/core'

import {EncodingHelperService} from '../../encoding-helper/encoding-helper.service'
import {Web3HelperService} from '../web3-helper/web3-helper.service'
import {SubmittedPapersIndex} from '../../contracts/submitted-papers-index/submitted-papers-index.token'
import {Web3Token} from '../web3/web3.token'

export class MockWeb3ClientService {
  indexNewFile() {}
  awaitTransaction() {}
  getAllManuscripts() {}
}

@Injectable()
export class Web3ClientService {
  submittedPapersIndex: any
  encodingHelper: EncodingHelperService
  web3Helper: Web3HelperService
  web3: any

  constructor (
               @Inject(SubmittedPapersIndex) submittedPapersIndex: any,
               @Inject(EncodingHelperService) encodingHelper: EncodingHelperService,
               @Inject(Web3HelperService) web3Helper: Web3HelperService,
               @Inject(Web3Token) web3: any
  ) {
    this.submittedPapersIndex = submittedPapersIndex
    this.encodingHelper = encodingHelper
    this.web3Helper = web3Helper
    this.web3 = web3
  }


  indexNewFile (fileHash) {
    const bytesOfAddress = this.encodingHelper.ipfsAddressToHexSha256(fileHash)
    const from = this.web3.eth.accounts[0]
    // todo: ensure that we have created an account.
    return this.submittedPapersIndex.push(bytesOfAddress, {from}).then((transactionInfo) => {
      return transactionInfo.receipt.transactionHash
    })
  }

  awaitTransaction (txnHash) {
    return this.web3Helper.getTransactionReceiptMined(this.web3, txnHash)
      .then((result: any) => {
        console.log('transaction mined!', result)
        return result.blockHash
      })
  }

  getAllManuscripts () {
    return this.submittedPapersIndex.getAll().then((fileHashesInHex) => {
      return fileHashesInHex.map(fileHash =>
        this.encodingHelper.hexSha256ToIpfsMultiHash(fileHash)
      )
    })
  }


}
