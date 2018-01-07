const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')
const expectThrow = require('../test/helpers/expectThrow')

console.log('*********', Object.keys(contract))

var Ownable = artifacts.require('../contracts/Ownable.sol')

contract('Ownable', function(accounts) {
  var instance;
  var numOfOwner;

  it('initalize ownable contract', async function() {

    instance = await Ownable.deployed({from: accounts[0]});

    // check inital owner
    var owner1 = await instance.owners(accounts[0]);
    assert.equal(owner1, true, "inital owner is not accounts[0]");

    // check inital number of owners
    numOfOwner = await instance.numberOfOwners();
    assert.equal(numOfOwner, 1, "inital number of owner is not 1");
  })

  it('add owners to contract', async function() {

    // add additional owner and check success
    await instance.grantOwnership(accounts[1])
    var owner2 = await instance.owners(accounts[1]);
    assert.equal(owner2, true, "new owner is not accounts[1]");

    // add additional owner as accounts[1] and check success
    await instance.grantOwnership(accounts[2], {from: accounts[1]})
    var owner3 = await instance.owners(accounts[2]);
    assert.equal(owner3, true, "new owner is not accounts[2]");

    // check final number of owners
    numOfOwner = await instance.numberOfOwners();
    assert.equal(numOfOwner, 3, "final number of owner is not 3");

    // try to add account which is already owner
    await expectRevert(instance.grantOwnership(accounts[2], {from: accounts[1]}))

    // try to add account with address 0
    await expectRevert(instance.grantOwnership(0, {from: accounts[1]}))
  })

  it('remove owners from contract', async function() {

    // remove owner and check success
    await instance.removeOwnership(accounts[0], {from: accounts[2]})
    var owner1 = await instance.owners(accounts[0]);
    assert.equal(owner1, false, "accounts[0] is still owner");

    // remove owner and check success
    await instance.removeOwnership(accounts[2], {from: accounts[1]})
    var owner3 = await instance.owners(accounts[2]);
    assert.equal(owner3, false, "accounts[2] is still owner");

    // check final number of owners
    numOfOwner = await instance.numberOfOwners();
    assert.equal(numOfOwner, 1, "final number of owner is not 1");

    // try to remove account which is no owner
    await expectRevert(instance.removeOwnership(accounts[4], {from: accounts[1]}))
  })

  it('check that removing all owners is impossible', async function() {

    // try to remove last owner and check for revert
    await expectRevert(instance.removeOwnership(accounts[1], {from: accounts[1]}));
  })

  it('checks ownership restrictions', async function() {

    // check for revert transaction of grantOwnership() & removeOwnership()
    // when msg.sender is not owner
    await expectRevert(instance.grantOwnership(accounts[0], {from: accounts[4]}));
    await instance.grantOwnership(accounts[2], {from: accounts[1]});
    await expectRevert(instance.removeOwnership(accounts[0], {from: accounts[4]}));
  })

})
