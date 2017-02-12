const expect = require('expect.js')
const Web3Client = require('./web3-client')
const web3Url = 'http://localhost:8545'

describe('web3-client', () => {
  describe('check connection', () => {
    it.only('should be connected to a local ethereum node', () => {
      const web3Client = new Web3Client(web3Url)
      expect(web3Client.isConnected()).to.equal(true)
    })
  })
})
