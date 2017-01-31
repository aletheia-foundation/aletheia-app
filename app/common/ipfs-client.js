const ipfsAPI = require('ipfs-api')
const EventEmitter = require('events').EventEmitter
const ee = new EventEmitter()
const fs = require('fs')

class IpfsClient extends EventEmitter {

  constructor (args) {
    super()
    this._ipfsClient = ipfsAPI(args.address)
    setInterval(this._checkConnection.bind(this), args.statusPollIntervalMs)
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

  addFileFromPath (args) {
    if (typeof args.filePath !== 'string') {
     throw {err: 'filePath was null'}
    }
    const fileStream = fs.createReadStream(args.filePath)
    // using the lower level method so that we do not reveal the user's local file path to the network
    return this._ipfsClient.files.add([{path: args.fileName, content: fileStream}])
  }
}

module.exports = IpfsClient
