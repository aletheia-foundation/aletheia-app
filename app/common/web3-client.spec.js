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
    // geth.debug = true
    geth.start(options, function (err, proc) {
      // get your geth on!
      if (err) console.log('error starting geth', err)
      web3Client = new Web3Client(WEB3_URL)
      done(err)
    })
  })
  after((done) => {
    geth.stop(() => {
      rimraf(ETH_TEST_CHAIN_DIR, (err) => {
        done(err)
      })
    })
  })
  describe('check connection', () => {
    it('should be connected to a local ethereum node', () => {
      expect(web3Client.isConnected()).to.equal(true)
    })
  })

  describe('createAccountIfNotExist', (done) => {
    it('should create an account if none exists', (done) => {
      // reset the chain somehow.
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
