const expectThrow = require('../test/helpers/expectThrow')

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

    const bytesOfAddress ='0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6'
    var instance = await SubmittedPapersIndex.deployed();
    await instance.push(bytesOfAddress);
    const result = await instance.getAll();

    assert.equal(result[0], '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6')
  });

})
