import {Injectable, Inject} from '@angular/core'

import {EncodingHelperService} from '../../encoding-helper/encoding-helper.service'
import {Web3HelperService} from '../web3-helper/web3-helper.service'
import {AletheiaPromise} from '../../contracts/aletheia-promise.token'
// import {MinimalManuscriptPromise} from '../../contracts/minimal-manuscript-promise.token'
import {Web3AccountService} from '../web3-account/web3-account.service'
import {ContractLoaderService} from '../../contracts/contract-loader.service'
import {Web3Token} from '../web3/web3.token'

export class MockWeb3ClientService {
  submitManuscript() {
  }

  awaitTransaction() {
  }

  getAllManuscripts() {
  }
}

@Injectable()
export class Web3ClientService {
  minimalManuscript: any
  aletheia: any

  constructor(// @Inject(MinimalManuscriptPromise) private minimalManuscriptPromise: any,
              @Inject(EncodingHelperService) private encodingHelper: EncodingHelperService,
              @Inject(Web3HelperService) private web3Helper: Web3HelperService,
              @Inject(Web3AccountService) private web3Account: Web3AccountService,
              @Inject(Web3Token) private web3: any,
              private contractLoader: ContractLoaderService) {
  }

  load() {
    return Promise.all([
        this.contractLoader.loadAletheia()
      ]
    ).then((results) => {
      this.aletheia = results[0]
    })
  }

  submitManuscript(fileHash: string, isAuthor: boolean) {
    const fileHashBytes = this.encodingHelper.ipfsAddressToHexSha256(fileHash)
    const from = this.web3Account.getAccount()
    // todo: ensure that we have created an account.
    return this.aletheia.newManuscript(fileHashBytes)
    .then((manuscriptReceipt) => {
      // This is available because the smartcontract defines address as a return value
      const newManuscriptAddress = manuscriptReceipt.logs[0].address
      return this.contractLoader.minimalManuscriptAt(newManuscriptAddress)
      .then((manuscript) => {
        if (isAuthor) {
          return manuscript.addAuthor(from)
        } else {
          return manuscriptReceipt
        }
      })
    })
  }

  awaitTransaction(txnHash): Promise<string> {
    return this.web3Helper.getTransactionReceiptMined(this.web3, txnHash)
    .then((result: any) => {
      return result.blockHash
    })
  }

  getAllManuscripts(): Promise<any> {
    return Promise.resolve([])
    // return this.submittedPapersIndex.getAll().then((fileHashesInHex) => {
    //   return fileHashesInHex.map(fileHash =>
    //     this.encodingHelper.hexSha256ToIpfsMultiHash(fileHash)
    //   )
    // })
  }
}
