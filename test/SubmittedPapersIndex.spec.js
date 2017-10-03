const EncodingHelper = require('../app/common/encoding-helper')
const expectThrow = require('../test/helpers/expectThrow')
// const assert = require('assert')
console.log('*********', Object.keys(contract))

var SubmittedPapersIndex = artifacts.require('../contracts/SubmittedPapersIndex.sol')

// contract is an embark replacement for describe.
// it resets the state of the contract between runs (but not between individual tests!)
contract('SubmittedPapersIndex', function (accounts) {

  // the contrarct state is not reset between indivdual tests
  // therfore the empty state must be tested before the stored value test
  it('refuses empty value', async function () {
    const bytesOfAddress = ''
    var instance = await SubmittedPapersIndex.deployed();
    // test for throw with empty value is used in push
    await expectThrow(
      instance.push(bytesOfAddress),
    );
    const result = await instance.getAll();

    assert.equal(result[0], null)
  });

  it('set storage value', async function () {
    const bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
    var instance = await SubmittedPapersIndex.deployed();
    await instance.push(bytesOfAddress);
    const result = await instance.getAll();

    assert.equal(EncodingHelper.hexSha256ToIpfsMultiHash(result[0]), 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
  });

})
