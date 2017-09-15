const EventEmitter = require('events').EventEmitter
const EncodingHelper = require('../encoding-helper')
const Web3Helper = require('./web3-helper')
const Web3 = require('web3')

// TODO: implement all methods in a nonblocking way, or use another means to prevent blocking the UI thread.
class Web3Client extends EventEmitter {
  constructor ({web3Provider, pollIntervalMs, submittedPapersIndexInstance}) {
    super()
    this._web3Provider = web3Provider

    this._SubmittedPapersIndex = submittedPapersIndexInstance

    this._web3 = new Web3(this._web3Provider)
    this._poll = setInterval(this._onPoll.bind(this), pollIntervalMs)
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
      this._address = resp
      return resp
    })
  }

  indexNewFile (fileHash) {
    const bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256(fileHash)
    const from = this._web3.eth.accounts[0]
    // todo: ensure that we have created an account.
    return this._SubmittedPapersIndex.push(bytesOfAddress, {from}).then((transactionInfo) => {
      return transactionInfo.receipt.transactionHash
    })
  }

  awaitTransaction (txnHash) {
    return Web3Helper.getTransactionReceiptMined(this._web3, txnHash)
    .then((result) => {
      console.log('transaction mined!', result)
      return result.blockHash
    })
  }

  getAllPapers () {
    return this._SubmittedPapersIndex.getAll().then((fileHashesInHex) => {
      return fileHashesInHex.map(fileHash =>
          EncodingHelper.hexSha256ToIpfsMultiHash(fileHash)
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

module.exports = Web3Client
