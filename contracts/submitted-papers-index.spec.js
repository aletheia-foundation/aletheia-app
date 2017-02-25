var assert = require('assert')
var Embark = require('embark')
var EmbarkSpec = Embark.initTests()
var web3 = EmbarkSpec.web3
var bs58 = require('bs58')
describe('SubmittedPapersIndex', function () {
  before(function (done) {
    var contractsConfig = {
      'SubmittedPapersIndex': {
        args: []
      }
    }
    EmbarkSpec.deployAll(contractsConfig, done)
  })

  it('set storage value', function (done) {
    const bytesOfAddress = bs58ToWeb3Bytes('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
    SubmittedPapersIndex.push('0x' + bytesOfAddress.slice(4), function () {
      SubmittedPapersIndex.getAll(function (err, result) {
        assert.equal(solidityAddressToIpfsAddress('0x1220', result[0]), 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
        done()
      })
    })
  })
})

function bs58ToWeb3Bytes (bs58Str) {
  return bs58.decode(bs58Str).toString('hex');
}

function solidityAddressToIpfsAddress(type, hash) {
  const rawHex = remove0x(type) + remove0x(hash);
  const rawHexBuffer = new Buffer(rawHex, 'hex');
  return bs58.encode(rawHexBuffer);
}

function remove0x(bytesStr){
  if (typeof bytesStr === 'string' && bytesStr.startsWith('0x')) {
    return bytesStr.slice(2);
  } else {
    throw {msg: 'bytesStr is not a string starting with 0x', bytesStr}
  }
}
