const expect = require('expect.js')
const Web3Client = require('./web3-client')
const geth = require('geth')
const rimraf = require('rimraf')

const ETH_TEST_CHAIN_DIR = '.ethereum-test'
const WEB3_URL = 'http://localhost:8546'

describe('web3-client', () => {
  let web3Client = null
  before((done) => {
    const options = {
      port: 30304,
      rpc: null,
      ipcpath: '.ethereum-test/geth.ipc',
      rpcport: 8546,
      datadir: ETH_TEST_CHAIN_DIR,
      rpcapi: 'admin,db,eth,net,web3,personal,web3',
      fast: 'init contracts/genesis.json' // workaround to get this command in here.
    }
    geth.start(options, function (err, proc) {
      if (err) console.log('error starting geth', err)
      web3Client = new Web3Client({
        web3Url: WEB3_URL,
        pollIntervalMs: 1000
      })
      done(err)
    })
  })
  after((done) => {
    web3Client.stop()
    geth.stop(() => {
      rimraf(ETH_TEST_CHAIN_DIR, (err) => {
        console.log('stopped eth client')
        done(err)
      })
    })
  })
  describe('check connection', () => {
    it('should be connected to a local ethereum node', () => {
      expect(web3Client.isConnected()).to.equal(true)
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

  describe('createAccountIfNotExist', () => {
    it('should create an account if none exists', (done) => {
      web3Client.createAccountIfNotExist()
      .then((acc) => {
        expect(acc).not.to.equal(null)
        expect(acc.length).to.equal(42)
        done()
      })
      .catch((err) => {
        done(err || 'error')
      })
    })

    it('should not create an account if one already exists', (done) => {
      web3Client.createAccountIfNotExist().then((acc1) => {
        expect(web3Client._web3.personal.listAccounts.length).to.equal(1)
        return web3Client.createAccountIfNotExist().then((acc2) => {
          expect(web3Client._web3.personal.listAccounts.length).to.equal(1)
          expect(acc2).to.equal(acc1)
          done()
        })
      })
      .catch((err) => {
        done(err || 'error')
      })
    })
    afterEach((done) => {
      rimraf(ETH_TEST_CHAIN_DIR + '/keystore', (e) => { done(e) })
    })
  })
})
