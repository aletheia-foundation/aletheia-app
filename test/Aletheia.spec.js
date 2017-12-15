const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')

console.log('*********', Object.keys(contract))

var Aletheia = artifacts.require('../contracts/Aletheia.sol')
var MinimalManuscript = artifacts.require('../contracts/MinimalManuscript.sol')

contract('Aletheia', function(accounts) {
  var instance;
  var adm1;
  var ma1;

  it('create new manuscript', async function() {

    instance = await Aletheia.deployed();
    // create new manuscript 1
    bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');
    await instance.newManuscript(bytesOfAddress, {from: accounts[0]});

    // get address of new contact by IPFS link
    adm1 = await instance.manuscriptAdress(bytesOfAddress);
    ma1 = await MinimalManuscript.at(adm1);

    // check for transfer of ownership for new manuscript
    let ownerMa1 = await ma1.getOwner();
    assert.equal(ownerMa1, accounts[0], "new owner is not author 1");
  })

  it('register new manuscript', async function() {

    // register manuscript
    await instance.registerPaper(adm1, {from: accounts[0]});

    // check for revert transaction when registerPaper() is not used by
    // manuscript owner
    await expectRevert(instance.registerPaper(adm1, {from: accounts[1]}));
  })

})
