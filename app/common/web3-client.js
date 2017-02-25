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
    return new Promise((res, rej) => {
      const bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256(fileHash)
      SubmittedPapersIndex.push(bytesOfAddress, (err) => {
        console.log('push done')
        if(err) {
          rej(err)
        } else {
          res()
        }
      })
    })
  }
  getAllFileHashes () {
    return new Promise ((res, rej) => {
      SubmittedPapersIndex.getAll((err, result) => {
        if(err) {
          rej(err)
        } else if (!result || !result.map){
          rej({err: 'SubmittedPapersIndex.getAll result is not an array'})
        } else{
          const ipfsMultiHashes = result.map((address)=>{return EncodingHelper.hexSha256ToIpfsMultiHash(address)})

          res(ipfsMultiHashes);
        }
      })
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
}

module.exports = Web3Client
