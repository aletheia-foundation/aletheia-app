const Web3 = require('web3')
const EventEmitter = require('events').EventEmitter
const config = require('config')
const EncodingHelper = require('./encoding-helper')

// TODO: implement all methods in a nonblocking way, or use another means to prevent blocking the UI thread.
class Web3Client extends EventEmitter {
  constructor ({web3Url, pollIntervalMs}) {
    super()
    this._web3 = new Web3(new Web3.providers.HttpProvider(web3Url))
    this._poll = setInterval(this._checkConnection.bind(this), pollIntervalMs)
    this._checkConnection()
  }
  stop () {
    clearInterval(this._poll)
  }
  isConnected () {
    return this._web3.isConnected()
  }
  createAccountIfNotExist () {
    return new Promise((res, rej) => {
      const existingAcc = this._web3.personal.listAccounts
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
    return SubmittedPapersIndex.push(bytesOfAddress)
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
}

module.exports = Web3Client
