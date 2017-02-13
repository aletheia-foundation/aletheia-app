const Web3 = require('web3')

class Web3Client {
  constructor (web3Url) {
    this._web3 = new Web3(new Web3.providers.HttpProvider(web3Url))
  }
  isConnected () {
    return this._web3.isConnected()
  }
  createAccountIfNotExist () {
    return new Promise((res, rej) => {
      const existingAcc = this._web3.personal.listAccounts
      if(existingAcc[0]) {
        return res(existingAcc[0])
      }
      else {
        const resp = this._web3.personal.newAccount()
        res(resp)
      }
    })
  }
}

module.exports = Web3Client
