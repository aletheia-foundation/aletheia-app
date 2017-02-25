const assert = require('assert')
const Embark = require('embark')
const EmbarkSpec = Embark.initTests()
const web3 = EmbarkSpec.web3
const EncodingHelper = require('../app/common/encoding-helper')

describe('SubmittedPapersIndex', function () {
  before(function (done) {
    const contractsConfig = {
      'SubmittedPapersIndex': {
        args: []
      }
    }
    EmbarkSpec.deployAll(contractsConfig, done)
  })

  it('set storage value', function (done) {
    const bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
    SubmittedPapersIndex.push(bytesOfAddress, function () {
      SubmittedPapersIndex.getAll(function (err, result) {
        assert.equal(EncodingHelper.hexSha256ToIpfsMultiHash(result[0]), 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
        done()
      })
    })
  })
})
