import { Injectable, Inject } from '@angular/core'

// import {EventEmitter} from 'events'
import {EncodingHelperService} from '../../encoding-helper/encoding-helper.service'
import {Web3HelperService} from '../web3-helper/web3-helper.service'
import {SubmittedPapersIndex} from '../../contracts/submitted-papers-index/submitted-papers-index.token'
import {Web3Provider} from '../web3-provider/web3-provider.token'
import Web3 from 'web3'
import {POLL_INTERVAL_MS} from '../../../Injection-tokens'

@Injectable()
export class Web3ClientService  {
  _web3Provider: any
  _SubmittedPapersIndex: any
  _web3: any
  _poll: any
  encodingHelper: EncodingHelperService
  web3Helper: Web3HelperService
  emit (str,obj,abj2) {}
  constructor (@Inject(Web3Provider) provider, @Inject(POLL_INTERVAL_MS) pollInterval: string, @Inject(SubmittedPapersIndex) submittedPapersIndex, encodingHelper: EncodingHelperService, web3Helper: Web3HelperService) {
    // super()
    this._web3Provider = provider
    this.encodingHelper = encodingHelper
    this.web3Helper = web3Helper
    this._SubmittedPapersIndex = submittedPapersIndex

    this._web3 = new Web3(this._web3Provider)
    this._poll = setInterval(this._onPoll.bind(this), pollInterval)
    this._checkConnection()
  }

  _onPoll () {
    this._checkConnection()
    this._checkBalance()
  }

  stop () {
    clearInterval(this._poll)
  }

  isConnected () {
    return this._web3.isConnected()
  }

  createAccountIfNotExist () {
    return new Promise((res, rej) => {
      const existingAcc = this._web3.eth.accounts
      if (existingAcc[0]) {
        return res(existingAcc[0])
      } else {
        const resp = this._web3.personal.newAccount()
        res(resp)
      }
    }).then((resp) => {
      return resp
    })
  }

  indexNewFile (fileHash) {
    const bytesOfAddress = this.encodingHelper.ipfsAddressToHexSha256(fileHash)
    const from = this._web3.eth.accounts[0]
    // todo: ensure that we have created an account.
    return this._SubmittedPapersIndex.push(bytesOfAddress, {from}).then((transactionInfo) => {
      return transactionInfo.receipt.transactionHash
    })
  }

  awaitTransaction (txnHash) {
    return this.web3Helper.getTransactionReceiptMined(this._web3, txnHash)
      .then((result: any) => {
        console.log('transaction mined!', result)
        return result.blockHash
      })
  }

  getAllPapers () {
    return this._SubmittedPapersIndex.getAll().then((fileHashesInHex) => {
      return fileHashesInHex.map(fileHash =>
        this.encodingHelper.hexSha256ToIpfsMultiHash(fileHash)
      )
    })
  }

  _checkConnection () {
    this._web3.net.getPeerCount((err, numPeers) => {
      if (err) {
        this.emit('peer-update', err, numPeers)
        console.error(err, err.stack)
        return
      } else {
        this.emit('peer-update', null, numPeers)
      }
    })
  }

  _checkBalance () {
    this._web3.eth.getBalance(this._web3.eth.accounts[0], (err, weiBalance) => {
      const ethBalance = this._web3.fromWei(weiBalance, 'ether')
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
