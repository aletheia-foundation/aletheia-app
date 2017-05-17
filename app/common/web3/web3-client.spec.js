const expect = require('expect.js')
const Web3Client = require('./web3-client')
const geth = require('geth')
const rimraf = require('rimraf')

const WEB3_URL = 'http://localhost:8545'
const q = require('q')
const sinon = require('sinon')
const Web3 = require('web3')

const contract = require('truffle-contract')
const submittedPapersIndexJson = require('../../../build/contracts/SubmittedPapersIndex.json')

describe('web3-client', () => {
  let web3Client = null

  before(() => {
    const indexContract = contract(submittedPapersIndexJson)
    const provider = new Web3.providers.HttpProvider(WEB3_URL)
    indexContract.setProvider(provider)

    return indexContract.deployed().then((instance) => {
      web3Client = new Web3Client({
        web3Provider: provider,
        pollIntervalMs: 1000,
        submittedPapersIndexInstance: instance
      })
    })
  })

  describe('_checkConnection', () => {
    it('should trigger peer-update listeners with 0 peers when no peers are connected', (done) => {
      web3Client.once('peer-update', (err, numPeers) => {
        expect(err).to.equal(null)
        expect(numPeers).to.equal(0)

        done()
      })
      web3Client._checkConnection()
    })
  })
  //
  // describe('createAccountIfNotExist', () => {
  //   it('should create an account if none exists', (done) => {
  //     web3Client.createAccountIfNotExist()
  //     .then((acc) => {
  //       expect(acc).not.to.equal(null)
  //       expect(acc.length).to.equal(42)
  //       done()
  //     })
  //     .catch((err) => {
  //       done({err})
  //     })
  //   })
  //
  //   it('should not create an account if one already exists', (done) => {
  //     web3Client.createAccountIfNotExist().then((acc1) => {
  //       expect(web3Client._web3.personal.listAccounts.length).to.equal(1)
  //       return web3Client.createAccountIfNotExist().then((acc2) => {
  //         expect(web3Client._web3.personal.listAccounts.length).to.equal(1)
  //         expect(acc2).to.equal(acc1)
  //         done()
  //       })
  //     })
  //     .catch((err) => {
  //       done({err})
  //     })
  //   })
  // })

  describe('indexNewFile', () => {

    it('should index a new file and return its filehash', () => {
      return web3Client.indexNewFile('QmcjsPrt3VhTcBPg5F7eTSfxsnQTnKHtqEt7ZpAQBKumTa').then((result) => {
        expect(result.length).to.equal(66)
      })
    })

    //todo: add contract logic to actually fail for invalid ipfs addresses
    // it('should return error on failure', (done) => {
    //   web3Client.indexNewFile('').then((result) => {
    //     done('should have rejected.')
    //   }).catch((err) => {
    //     expect(err).to.equal('invalid')
    //     done()
    //   })
    // })
  })
  describe('awaitIndexNewFile', () => {
    let pushResult

    beforeEach(function () {
      const Web3Helper = require('./web3-helper')

      pushResult = q.defer()

      sinon.stub(Web3Helper, 'getTransactionReceiptMined', (txhash) => {
        return pushResult.promise
      })
    })
    it('should wait for file to be mined', (done) => {
      pushResult.resolve({blockHash: 'abc123'})
      web3Client.awaitIndexNewFile('TX_HASH').then((result) => {
        expect(result).to.equal('abc123')
        done()
      }).catch((err) => {
        done({err})
      })
    })
  })
})
