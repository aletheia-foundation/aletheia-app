const expectRevert = require('../test/helpers/expectRevert')

console.log('*********', Object.keys(contract))

var Aletheia = artifacts.require('../contracts/Aletheia.sol')
var MinimalManuscript = artifacts.require('../contracts/MinimalManuscript.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')
var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')

contract('Aletheia', function(accounts) {
  var instance, instanceRep, instanceManscptInd;
  var addressManuscript1;
  var manuscript1;
  var bytesOfAddress = '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6'

  it('transfer ownership of reputation contract to Aletheia', async function() {

    instanceRep = await Reputation.deployed();
    instanceManscptInd = await ManuscriptIndex.deployed();
    instance = await Aletheia.deployed();

    await instanceRep.grantAccess(instance.address, {from: accounts[0]});
    await instanceManscptInd.grantAccess(instance.address, {from: accounts[0]});

    // check new owner of reputation
    var ownerRep = await instanceRep.allowedAccounts(instance.address);
    assert.equal(ownerRep, true, "new owner is not Aletheia")

    // check new owner of manuscriptIndex
    var ownerManscptInd = await instanceManscptInd.allowedAccounts(instance.address);
    assert.equal(ownerManscptInd, true, "new owner is not Aletheia")
  })

  it('create new manuscripts', async function() {
    // create new manuscript 1
    await instance.newManuscript(bytesOfAddress, {from: accounts[0]});

    // get address of new contact by IPFS link
    addressManuscript1 = await instanceManscptInd.manuscriptAddress(bytesOfAddress);
    manuscript1 = await MinimalManuscript.at(addressManuscript1);

    // check for transfer of ownership for new manuscript
    let ownerManuscript1 = await manuscript1.isOwner(accounts[0]);
    assert.equal(ownerManuscript1, true, "new owner is not author 1");
  })

  it('register new manuscript', async function() {

    // register manuscript
    await instance.registerPaper(addressManuscript1, {from: accounts[0]});
    
    // check success of registration
    assert.equal(await instance.registered(addressManuscript1), true,
     "manuscript is not registered");

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

    // verify empty storage of registered
    assert.equal(await instance.registered(addressManuscript1), false,
     "registered mapping is not empty");
  })

})
