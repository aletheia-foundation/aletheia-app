const ipfsAPI = require('ipfs-api')
const EventEmitter = require('events').EventEmitter
const ee = new EventEmitter()
const fs = require('fs')

class IpfsClient extends EventEmitter {

  constructor ({address, pollIntervalMs}) {
    super()
    this._ipfsClient = ipfsAPI(address)
    setInterval(this._checkConnection.bind(this), pollIntervalMs)
    this._checkConnection()
  }

  _checkConnection () {
    return this._ipfsClient.swarm.peers().then((result) => {
      this.emit('peer-update', null, result.length)
    }).catch((e) => {
      this.emit('peer-update', e, 0)
      console.error(e, e.stack)
    })
  }

  addFileFromPath ({filePath, fileName}) {
    if (typeof filePath !== 'string') {
      throw {err: 'filePath was null'}
    }
    const fileStream = fs.createReadStream(filePath)
    // using the lower level method so that we do not reveal the user's local file path to the network
    return this._ipfsClient.files.add([{path: fileName, content: fileStream}])
  }
}

module.exports = IpfsClient
