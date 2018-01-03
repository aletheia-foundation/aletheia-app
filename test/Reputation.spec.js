const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')
const expectThrow = require('../test/helpers/expectThrow')

console.log('*********', Object.keys(contract))

var Reputation = artifacts.require('../contracts/Reputation.sol')

contract('Reputation', function(accounts) {
  var instance;
  var reputation1, reputation2, reputation3, reputation4, reputation5, reputation6;
  var manuscript1;

  it('add reputation to account', async function() {

    instance = await Reputation.deployed();
    // check inital reputation
    reputation1 = await instance.reputationOf(accounts[0]);
    assert.equal(reputation1, 0, "inital reputation is not 0");

    // add reputation
    await instance.addReputation(accounts[0], 100);

    // check final reputation
    reputation2 = await instance.reputationOf(accounts[0]);
    assert.equal(reputation2, 100, "new reputation is not 100");
  })

  it('remove reputation from account', async function() {

    // check inital reputation
    reputation3 = await instance.reputationOf(accounts[0]);
    assert.equal(reputation3, 100, "inital reputation is not 100");

    // substract reputation
    await instance.removeReputation(accounts[0], 50);

    // check final reputation
    reputation4 = await instance.reputationOf(accounts[0]);
    assert.equal(reputation4, 50, "new reputation is not 50");

  })

  it('check that negative reputation is impossible', async function() {
    
    // check inital reputation
    reputation5 = await instance.reputationOf(accounts[0]);
    assert.equal(reputation5, 50, "inital reputation is not 50");

    // try to sustract more reputation then there is for the account
    await expectThrow(instance.removeReputation(accounts[0], 100));

    // check final reputation
    reputation6 = await instance.reputationOf(accounts[0]);
    assert.equal(reputation6, 50, "reputation is not 50");

  })

  it('checks ownership restrictions', async function() {

    // check for revert transaction of addReputation() & removeReputation()
    // when msg.sender is not owner
    await expectRevert(instance.addReputation(accounts[0], 100, {from: accounts[1]}));
    await expectRevert(instance.removeReputation(accounts[0], 100, {from: accounts[1]}));
  })


})
