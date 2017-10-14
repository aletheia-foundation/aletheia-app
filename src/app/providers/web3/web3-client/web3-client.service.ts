import { Injectable, Inject } from '@angular/core'

import {EncodingHelperService} from '../../encoding-helper/encoding-helper.service'
import {Web3HelperService} from '../web3-helper/web3-helper.service'
import {SubmittedPapersIndex} from '../../contracts/submitted-papers-index/submitted-papers-index.token'
import {POLL_INTERVAL_MS} from '../../../Injection-tokens'
import {EventEmitter} from 'events'
import {Web3Token} from '../web3/web3.token'

@Injectable()
export class Web3ClientService extends EventEmitter {
  submittedPapersIndex: any
  encodingHelper: EncodingHelperService
  web3Helper: Web3HelperService
  web3: any
  poll: any

  constructor (@Inject(POLL_INTERVAL_MS) pollInterval: string,
               @Inject(SubmittedPapersIndex) submittedPapersIndex: any,
               @Inject(EncodingHelperService) encodingHelper: EncodingHelperService,
               @Inject(Web3HelperService) web3Helper: Web3HelperService,
               @Inject(Web3Token) web3: any
  ) {
    super()
    this.submittedPapersIndex = submittedPapersIndex
    this.encodingHelper = encodingHelper
    this.web3Helper = web3Helper
    this.web3 = web3
    this.poll = setInterval(this.onPoll.bind(this), pollInterval)
    this.checkConnection()
  }

  stop () {
    clearInterval(this.poll)
  }

  isConnected () {
    return this.web3.isConnected()
  }

  createAccountIfNotExist () {
    return new Promise((res, rej) => {
      const existingAcc = this.web3.eth.accounts
      if (existingAcc[0]) {
        return res(existingAcc[0])
      } else {
        const resp = this.web3.personal.newAccount()
        res(resp)
      }
    }).then((resp) => {
      return resp
    })
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

  getAllPapers () {
    return this.submittedPapersIndex.getAll().then((fileHashesInHex) => {
      return fileHashesInHex.map(fileHash =>
        this.encodingHelper.hexSha256ToIpfsMultiHash(fileHash)
      )
    })
  }

  private onPoll () {
    this.checkConnection()
    this.checkBalance()
  }

  private checkConnection () {
    this.web3.net.getPeerCount((err, numPeers) => {
      if (err) {
        this.emit('peer-update', err, numPeers)
        console.error(err, err.stack)
        return
      } else {
        this.emit('peer-update', null, numPeers)
      }
    })
  }

  private checkBalance () {
    if(this.web3.eth.accounts === null) {
      const err = new Error('unable to find blockchain account to check balance')
      this.emit('balance-update',err,0)
      return
    }
    this.web3.eth.getBalance(this.web3.eth.accounts[0], (err, weiBalance) => {
      const ethBalance = this.web3.fromWei(weiBalance, 'ether')
      if (err) {
        this.emit('balance-update', err, ethBalance)
        console.error(err, err.stack)
        return
      } else {
        this.emit('balance-update', null, ethBalance)
      }
    })
  }

}
