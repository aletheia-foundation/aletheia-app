var assert = require('assert')
var Embark = require('embark')
var EmbarkSpec = Embark.initTests()
var web3 = EmbarkSpec.web3
var bs58 = require('bs58')
describe('SubmittedPapersIndex', function () {
  before(function (done) {
    const bytesOfAddress = bs58ToWeb3Bytes('QmcjsPrt3VhTcBPg5F7eTSfxsnQTnKHtqEt7ZpAQBKumTV')

    var contractsConfig = {
      'SubmittedPapersIndex': {
        args: [bytesOfAddress]
      }
    }
    EmbarkSpec.deployAll(contractsConfig, done)
  })

  it.only('should set constructor value', function (done) {
    SubmittedPapersIndex.storedData(function (err, result) {
      assert.equal(web3BytesToBs58(result), 'QmcjsPrt3VhTcBPg5F7eTSfxsnQTnKHtqEt7ZpAQBKumTV')
      done()
    })
  })

  it('set storage value', function (done) {
    SubmittedPapersIndex.set(150, function () {
      SubmittedPapersIndex.get(function (err, result) {
        assert.equal(result.toNumber(), 150)
        done()
      })
    })
  })
})

function bs58ToWeb3Bytes (bs58Str) {
  return '0x' + bs58.decode('QmcjsPrt3VhTcBPg5F7eTSfxsnQTnKHtqEt7ZpAQBKumTV').toString('hex');
}

function web3BytesToBs58 (bytesStr) {
  if (bytesStr.startsWith('0x')) {
    return bs58.encode(new Buffer(bytesStr.slice(2), 'hex'));
  } else {
    throw {msg: 'bytesStr does not start with 0x', bytesStr}
  }
}
