const config = require('config')
const contract = require('truffle-contract')
const Web3 = require('web3')
const Web3Client = require('./web3-client')
const SubmittedPapersIndexJson = require(
  '../../../build/contracts/SubmittedPapersIndex.json'
)
const SubmittedPapersIndexAddress = require(
  '../../../build/addresses/SubmittedPapersIndex.development.json'
).address

class Web3ClientFactory {
  static getDefaultInstance () {
    return Web3ClientFactory.getInstance({
      web3Url: config.get('web3.url'),
      pollIntervalMs: config.get('web3.pollIntervalMs'),
      submittedPapersIndexAddress: SubmittedPapersIndexAddress
    })
  }

  static getInstance ({web3Url, pollIntervalMs, submittedPapersIndexAddress}) {
    const provider = new Web3.providers.HttpProvider(web3Url)
    const indexContract = contract(SubmittedPapersIndexJson)
    indexContract.setProvider(provider)
    return indexContract.at(submittedPapersIndexAddress).then((indexInstance) => {
      return new Web3Client({
        web3Provider: provider,
        pollIntervalMs,
        submittedPapersIndexInstance: indexInstance
      })
    })
  }
}
module.exports = Web3ClientFactory
