const assert = require('assert')
const EncodingHelper = require('../app/common/encoding-helper')
var SubmittedPapersIndex = artifacts.require("./SubmittedPapersIndex.sol");

describe('SubmittedPapersIndex', function () {
  let instance;
  before(function () {
    return SubmittedPapersIndex.deployed().then((instanceLocal)=>{
      instance = instanceLocal;
    })
  })

  it('set storage value', function () {
    const bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
    return instance.push(bytesOfAddress).then(() =>{
      return instance.getAll()
    }).then((result) => {
      assert.equal(EncodingHelper.hexSha256ToIpfsMultiHash(result[0]), 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
    });
  })
})
