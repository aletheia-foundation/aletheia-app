import {Injectable} from '@angular/core'
import * as IPFS from 'ipfs'
import * as fs from 'fs'
import {Config} from '../../../../../config/Config'
import {ElectronService} from '../../electron.service'
import {EncodingHelper} from '../../encoding-helper/encoding-helper'

export class MockIpfsClientService {
  addFileFromPath() {
  }
  async getStream() {}
}

//  Ipfs can only be loaded in electron mode (not web or in karma unit tests)
@Injectable()
export class IpfsClientService {
  ipfsClient: IPFS

  constructor(config: Config,
              private electronService: ElectronService
  ) {
    const gatewayUrl = config.ipfs.gatewayUrl
    if (this.electronService.isElectron()) {
      const factory = require('ipfs-api')
      this.ipfsClient = factory(gatewayUrl)
    }
  }

  async getStream(_ethereumHash: string) {
    const ipfsHash = EncodingHelper.hexSha256ToIpfsMultiHash(_ethereumHash)
    return (<any> this.ipfsClient.files).catReadableStream(ipfsHash)
  }

  addFileFromPath(fileName: string, filePath: string) {
    const fileStream = fs.createReadStream(filePath)
    // using the lower level method so that we do not reveal the user's local file path to the network
    return this.ipfsClient.files.add([{path: fileName, content: fileStream}])
  }
}
