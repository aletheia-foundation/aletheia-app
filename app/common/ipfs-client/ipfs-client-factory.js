const config = require('config')
const IpfsClient = require('./ipfs-client')
class IpfsClientFactory {
  static getDefaultInstance () {
    return new IpfsClient({
      address: config.get('ipfs.gatewayUrl'),
      pollIntervalMs: config.get('ipfs.pollIntervalMs')
    })
  }
}
module.exports = IpfsClientFactory
