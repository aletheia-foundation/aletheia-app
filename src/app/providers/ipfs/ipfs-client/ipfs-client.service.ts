import { Injectable } from '@angular/core'
import * as IPFS from 'ipfs'
import * as fs from 'fs'
import {Config} from '../../../../../config/Config'
import {ElectronService} from '../../electron.service'

//  Ipfs can only be loaded in electron mode (not web or in karma unit tests)
@Injectable()
export class IpfsClientService {
  ipfsClient: IPFS

  constructor(config: Config, private electronService : ElectronService) {
    const gatewayUrl = config.ipfs.gatewayUrl
    if(this.electronService.isElectron()) {
      let factory = window.require('ipfs-api')
      this.ipfsClient = factory(gatewayUrl)
    }
  }

  addFileFromPath ( fileName: string, filePath: string) {
    const fileStream = fs.createReadStream(filePath)
    // using the lower level method so that we do not reveal the user's local file path to the network
    return this.ipfsClient.files.add([{path: fileName, content: fileStream}])
  }
}

// const ee = new EventEmitter()
// const fs = require('fs')
//
// class IpfsClient extends EventEmitter {
//
//   constructor ({address, pollIntervalMs}) {
//     super()
//     this._ipfsClient = ipfsAPI(address)
//   }
//
//   _checkConnection () {
//     return this._ipfsClient.swarm.peers().then((result) => {
//       this.emit('peer-update', null, result.length)
//     }).catch((e) => {
//       this.emit('peer-update', e, 0)
//       console.error(e, e.stack)
//     })
//   }
//
//   downloadFile ({hash}) {
//   }
//
//   addFileFromPath ({filePath, fileName}) {
//     if (typeof filePath !== 'string') {
//       throw {err: 'filePath was null'}
//     }
//     const fileStream = fs.createReadStream(filePath)
//     // using the lower level method so that we do not reveal the user's local file path to the network
//     return this._ipfsClient.files.add([{path: fileName, content: fileStream}])
//   }
// }
//
// module.exports = IpfsClient
