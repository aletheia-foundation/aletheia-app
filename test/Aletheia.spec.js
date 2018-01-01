const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')

console.log('*********', Object.keys(contract))

var Aletheia = artifacts.require('../contracts/Aletheia.sol')
var MinimalManuscript = artifacts.require('../contracts/MinimalManuscript.sol')

contract('Aletheia', function(accounts) {
  var instance;
  var addressManuscript1;
  var manuscript1;
  var bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');

  it('create new manuscript', async function() {

    instance = await Aletheia.deployed();
    // create new manuscript 1
    await instance.newManuscript(bytesOfAddress, {from: accounts[0]});

    // get address of new contact by IPFS link
    addressManuscript1 = await instance.manuscriptAddress(bytesOfAddress);
    manuscript1 = await MinimalManuscript.at(addressManuscript1);

    // check for transfer of ownership for new manuscript
    let ownerManuscript1 = await manuscript1.getOwner();
    assert.equal(ownerManuscript1, accounts[0], "new owner is not author 1");
  })

  it('register new manuscript', async function() {

    // register manuscript
    await instance.registerPaper(addressManuscript1, {from: accounts[0]});

    // check for revert transaction when registerPaper() is not used by
    // manuscript owner
    await expectRevert(instance.registerPaper(addressManuscript1, {from: accounts[1]}));
  })

  it('checks ownership restrictions', async function() {

    // check for revert transaction of remove() when msg.sender is not owner
    await expectRevert(instance.remove({from: accounts[1]}));
  })

  it('removes Aletheia contract', async function() {

    // selfdestruct Aletheia contract
    await instance.remove({from: accounts[0]});

    // verify empty storage of manuscriptAddress
    var addressManuscript2 = await instance.manuscriptAddress(bytesOfAddress);
    assert.equal(addressManuscript2, 0, "address storage is not set to zero")
  })

})
