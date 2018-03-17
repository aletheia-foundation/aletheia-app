const expectRevert = require('../test/helpers/expectRevert')
const expectThrow = require('../test/helpers/expectThrow')

console.log('*********', Object.keys(contract))

var Accessible = artifacts.require('../contracts/Accessible.sol')

contract('Accessible', function(accounts) {
  var instance;
  var numOfAccess;

  it('initalize accessible contract', async function() {

    instance = await Accessible.deployed({from: accounts[0]});

    // check inital number of accounts with access
    numOfAccess = await instance.numberOfAccounts();
    assert.equal(numOfAccess, 0, "inital number of allowed accounts is not 0");
  })

  it('give access to accounts for contract', async function() {

    // give access to account and check success
    await instance.grantAccess(accounts[1])
    var access2 = await instance.allowedAccounts(accounts[1]);
    assert.equal(access2, true, "new allowed account is not accounts[1]");

    // give additional account access as accounts[1] and check success
    await instance.grantAccess(accounts[2], {from: accounts[1]})
    var access3 = await instance.allowedAccounts(accounts[2]);
    assert.equal(access3, true, "new allowed account is not accounts[2]");

    // check final number of accounts with access
    numOfAccess = await instance.numberOfAccounts();
    assert.equal(numOfAccess, 2, "final number of allowed accounts is not 3");

    // try to add account which has already access
    await expectRevert(instance.grantAccess(accounts[2], {from: accounts[1]}))

    // try to add account with address 0
    await expectRevert(instance.grantAccess(0, {from: accounts[1]}))
  })

  it('remove access from contract', async function() {

    // remove access right and check success
    await instance.removeAccess(accounts[1], {from: accounts[2]})
    var access1 = await instance.allowedAccounts(accounts[0]);
    assert.equal(access1, false, "accounts[0] has still access");

    // check final number of accounts with access
    numOfAccess = await instance.numberOfAccounts();
    assert.equal(numOfAccess, 1, "final number of allowed accounts is not 1");

    // try to remove account which is has no access
    await expectRevert(instance.removeAccess(accounts[4], {from: accounts[1]}))
  })

  it('checks accessship restrictions', async function() {

    // check for revert transaction of grantaccessship() & removeaccessship()
    // when msg.sender has no access
    await expectRevert(instance.grantAccess(accounts[0], {from: accounts[4]}));
    await instance.grantAccess(accounts[3], {from: accounts[0]});
    await expectRevert(instance.removeAccess(accounts[3], {from: accounts[4]}));
  })

})
