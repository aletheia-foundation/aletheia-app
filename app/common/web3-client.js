const Web3 = require('web3')

class Web3Client {
  constructor (web3Url) {
    this._web3 = new Web3(new Web3.providers.HttpProvider(web3Url))
  }
  isConnected () {
    return this._web3.isConnected()
  }
}

module.exports = Web3Client
