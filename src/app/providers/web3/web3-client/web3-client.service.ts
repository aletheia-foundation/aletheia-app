import {Injectable, Inject} from '@angular/core'

import {EncodingHelper} from '../../encoding-helper/encoding-helper'
import {Web3HelperService} from '../web3-helper/web3-helper.service'
import {AletheiaPromise} from '../../contracts/aletheia-promise.token'
import {Web3AccountService} from '../web3-account/web3-account.service'
import {ContractLoaderService} from '../../contracts/contract-loader.service'
import {Web3Token} from '../web3/web3.token'
import {ManuscriptViewModel} from '../../../components/list-papers/ManuscriptViewModel'

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
  readonly NULL_BYTE = '0x0000000000000000000000000000000000000000000000000000000000000000'
  manuscriptIndex: any
  aletheia: any

  constructor(
              @Inject(Web3HelperService) private web3Helper: Web3HelperService,
              @Inject(Web3AccountService) private web3Account: Web3AccountService,
              @Inject(Web3Token) private web3: any,
              private contractLoader: ContractLoaderService) {
  }

  load() {
    return Promise.all([
        this.contractLoader.loadAletheia(),
        this.contractLoader.loadManuscriptIndex()
      ]
    ).then((results) => {
      this.aletheia = results[0]
      this.manuscriptIndex = results[1]
    })
  }

  submitManuscript(fileHash: string, title: string, isAuthor: boolean) {
    const fileHashBytes = EncodingHelper.ipfsAddressToHexSha256(fileHash)
    const from = this.web3Account.getAccount()
    // todo: ensure that we have created an account.
    const authors = isAuthor ? [from] : []
    return this.aletheia.newManuscript(fileHashBytes, title, authors)
    .then((manuscriptReceipt) => {
      // This is available because the smartcontract defines address as a return value
      const newManuscriptAddress = manuscriptReceipt.logs[0].address
      return this.contractLoader.minimalManuscriptAt(newManuscriptAddress)
    })
  }

  awaitTransaction(txnHash): Promise<string> {
    return this.web3Helper.getTransactionReceiptMined(this.web3, txnHash)
    .then((result: any) => {
      return result.blockHash
    })
  }

  async getAllManuscripts(): Promise<ManuscriptViewModel[]> {
    const allManuscripts = []
    let manuscriptHash = await this.manuscriptIndex.dllIndex(0, true)
    while (this.NULL_BYTE !== manuscriptHash) {
      const address = await this.manuscriptIndex.manuscriptAddress(manuscriptHash)
      const manuscriptContract = this.contractLoader.minimalManuscriptAt(address)
      const manuscriptViewModel = await this.getManuscriptViewModel(manuscriptContract)
      allManuscripts.push(manuscriptViewModel)
      manuscriptHash = await this.manuscriptIndex.dllIndex(manuscriptHash, true)
    }
    return allManuscripts;
  }

  async getManuscriptViewModel(manuscriptContract): Promise<ManuscriptViewModel> {
    return {
      dataAddress: await manuscriptContract.dataAddress(),
      contractAddress: manuscriptContract.address,
      title: await manuscriptContract.title()
    }
  }
}
