const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')
const expectThrow = require('../test/helpers/expectThrow')

console.log('*********', Object.keys(contract))

var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')

contract('CommunityVotes', function(accounts) {
  var instance;
  var reputation1, reputation2, reputation3, reputation4, reputation5, reputation6;
  var manuscript1;
  bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');

  it('create votings', async function() {
    instance = await CommunityVotes.deployed();

    // give access to accounts[0] to create votings and to vote
    for(var cnt=0; cnt<9; cnt++) {
      await instance.grantAccess(accounts[cnt]);
    }

    // create voting
    await instance.createVoting(bytesOfAddress, {from: accounts[0]});

    // check if voting was started
    var voting1 = await instance.getVoting(bytesOfAddress);
    assert(voting1[0].toNumber() > 0, "voting start block not set");

    // check that list of voters is empty & no votes have been counted
    assert.equal(voting1[1].toNumber(), 0, "voting count not zero");
    assert.equal(voting1[2].length, 0, "voter list not empty");

    // check that vote is active
    assert(await instance.votingActive(bytesOfAddress) > 1, "voting closed" );

    // try to start same voting again
    await expectRevert(instance.createVoting(bytesOfAddress, {from: accounts[0]}));
  })


  it('vote for and against manuscript', async function() {

    // check that voting is still open
    assert(await instance.votingActive(bytesOfAddress) > 1 , "voting is closed");

    // vote for manuscript
    for(var cnt=0; cnt<6; cnt++) {
      if (await instance.votingActive(bytesOfAddress) > 1 ) {
        await instance.vote(bytesOfAddress, accounts[cnt], true);
      }
      else {
        await expectRevert(instance.vote(bytesOfAddress, accounts[cnt], true));
      }
    }
    // vote agains manuscript until voting is over (assumes votingDuration = 8)
    for(var cnt=6; cnt<9; cnt++) {
      if (await instance.votingActive(bytesOfAddress) > 1 ) {
        await instance.vote(bytesOfAddress, accounts[cnt], false);
      }
      else {
        await expectRevert(instance.vote(bytesOfAddress, accounts[cnt], false));
      }
    }

    // check that voting is closed
    assert.equal(await instance.votingActive(bytesOfAddress), 0 ,
      "voting is not closed");

    // check that manuscript was accepted
    var nVoters = await instance.getVoting(bytesOfAddress);
    assert(nVoters[1] > nVoters[2].length-nVoters[1], "manuscript was not accepted");

    // try to start same voting again
    await expectRevert(instance.createVoting(bytesOfAddress, {from: accounts[0]}));
  })

  it('check voting restrictions', async function() {
    // check that voting twice is not possible
  })


    //assert.equal(reputation1, 0, "inital reputation is not 0");
    //
    // // add reputation
    // await instance.addReputation(accounts[0], 100, {from: accounts[0]});
    //
    // // check final reputation
    // reputation2 = await instance.reputationOf(accounts[0]);
    // assert.equal(reputation2, 100, "new reputation is not 100");
  //})

  // it('remove reputation from account', async function() {
  //
  //   // check inital reputation
  //   reputation3 = await instance.reputationOf(accounts[0]);
  //   assert.equal(reputation3, 100, "inital reputation is not 100");
  //
  //   // substract reputation
  //   await instance.removeReputation(accounts[0], 50);
  //
  //   // check final reputation
  //   reputation4 = await instance.reputationOf(accounts[0]);
  //   assert.equal(reputation4, 50, "new reputation is not 50");
  //
  // })
  //
  // it('check that negative reputation is impossible', async function() {
  //
  //   // check inital reputation
  //   reputation5 = await instance.reputationOf(accounts[0]);
  //   assert.equal(reputation5, 50, "inital reputation is not 50");
  //
  //   // try to sustract more reputation then there is for the account
  //   await expectThrow(instance.removeReputation(accounts[0], 100));
  //
  //   // check final reputation
  //   reputation6 = await instance.reputationOf(accounts[0]);
  //   assert.equal(reputation6, 50, "reputation is not 50");
  //
  // })
  //
  // it('checks ownership restrictions', async function() {
  //
  //   // check for revert transaction of addReputation() & removeReputation()
  //   // when msg.sender is not owner
  //   await expectRevert(instance.addReputation(accounts[0], 100, {from: accounts[1]}));
  //   await expectRevert(instance.removeReputation(accounts[0], 100, {from: accounts[1]}));
  // })


})
