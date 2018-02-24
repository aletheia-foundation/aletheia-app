const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')
const expectThrow = require('../test/helpers/expectThrow')

console.log('*********', Object.keys(contract))

var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')

contract('CommunityVotes', function(accounts) {
  var instance;
  var reputation1, reputation2, reputation3, reputation4, reputation5, reputation6;
  var manuscript1;
  var bytesOfAddress = [], ipfsAddress = [];
  var nClosed;
  var nForVote;
  ipfsAddress[0] = 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH';
  ipfsAddress[1] = 'QmdavdTfHgbbLCp5DUkZDYGoHwgDuQ2Zf2vpMYnJ6i71n2';
  ipfsAddress[2] = 'QmWk4iniHmBZwpjwSFNmP7im4uEgVBgSFiPu2pU168353k';
  ipfsAddress[3] = 'QmdxbPmxWus45myDDCXMfvyBnn5mLf2QsocKeVnDgxj2QR';
  ipfsAddress[4] = 'QmRPCdKARctQAoooPfaxZWjSMPuzSEvzL44k3e7PPKtVib';
  ipfsAddress[5] = 'QmT8f6vZRdorpsWzyiSighyR7XzyeATqwqtQwwv38KvgHn';
  for(var cnt=0; cnt<ipfsAddress.length; cnt++) {
    bytesOfAddress[cnt] = EncodingHelper.ipfsAddressToHexSha256(ipfsAddress[cnt]);
  }

  bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');

  it('create votings', async function() {
    instance = await CommunityVotes.deployed();

    // give access to accounts[0] to create votings and to vote
    for(var cnt=0; cnt<9; cnt++) {
      await instance.grantAccess(accounts[cnt]);
    }

    // create voting
    await instance.createVoting(bytesOfAddress[0], {from: accounts[0]});
    await instance.createVoting(bytesOfAddress[1], {from: accounts[0]});

    // check if votings were started
    for(var cnt=0; cnt<2; cnt++) {
      var voting1 = await instance.getVoting(bytesOfAddress[cnt]);
      assert(voting1[0].toNumber() > 0, "voting start block not set");

      // check that list of voters is empty & no votes have been counted
      assert.equal(voting1[1].toNumber(), 0, "voting count not zero");
      assert.equal(voting1[2].length, 0, "voter list not empty");

      // check that votes are active
      assert(await instance.votingActive(bytesOfAddress[cnt]) > 1, "voting closed" );
    }

    // try to start same voting again
    await expectRevert(instance.createVoting(bytesOfAddress[0], {from: accounts[0]}));
  })

  it('vote for and against manuscript', async function() {

    // check that voting is still open
    assert(await instance.votingActive(bytesOfAddress[0]) > 1 , "voting is closed");

    // vote for manuscript
    nClosed = 0;
    for(var cnt=0; cnt<9; cnt++) {
      // vote 5 times for manuscript then against it
      nForVote = 5;
      if (cnt < nForVote) {var vote = true} else {var vote = false}
      // check that voting is still open
      if (await instance.votingActive(bytesOfAddress[0]) > 1 ) {
        // vote
        await instance.vote(bytesOfAddress[0], accounts[cnt], vote);
      }
      else {
        // save cnt when voting was closed
        if (nClosed == 0) {nClosed = cnt};
        // try to vote
        await expectRevert(instance.vote(bytesOfAddress[0], accounts[cnt], vote));
      }
    }

    // check that voting is closed
    assert.equal(await instance.votingActive(bytesOfAddress[0]), 0 ,
      "voting is not closed");

    // try to start same voting again
    await expectRevert(instance.createVoting(bytesOfAddress[0], {from: accounts[0]}));

    // try to vote on a closed voting
    await expectRevert(instance.vote(bytesOfAddress[9], accounts[9], false));

  })

  it('check voting results', async function(){

    // check that manuscript was accepted
    var nVoters = await instance.getVoting(bytesOfAddress[0]);
    assert(nVoters[1] > nVoters[2].length-nVoters[1], "manuscript was not accepted");

    // check number of positive votes
    var voting2 = await instance.getVoting(bytesOfAddress[0]);
    assert.equal(voting2[1].toNumber(), nForVote, "number of positive votes not correct");

    // check if all voters are in voter list
    for(var cnt=0; cnt<nClosed; cnt++) {
      assert.equal(voting2[2][cnt], accounts[cnt], "voter list not empty");
    }

    // check individual votes
    for(var cnt=0; cnt<nClosed; cnt++) {
      // get voter data
      var voter = await instance.getVote(bytesOfAddress[0], voting2[2][cnt])
      // set comparrision value first nForVote voted for manuscript
      if (cnt < nForVote) {var vote = true} else {var vote = false}
      // compare
      assert.equal(voter[1], vote, "voter ");
    }
  })

  it('check some voting restrictions', async function() {

    // start new voting
    await instance.createVoting(bytesOfAddress[2], {from: accounts[0]});

    // check that voting twice is not possible
    await instance.vote(bytesOfAddress[2], accounts[0], true);
    await instance.vote(bytesOfAddress[2], accounts[1], true);
    await expectRevert(instance.vote(bytesOfAddress[2], accounts[0], true));
    await expectRevert(instance.vote(bytesOfAddress[2], accounts[0], false));

    // check for revert when non-existing voting is checked for being active
    await expectRevert(instance.votingActive(bytesOfAddress[4]));
  })



  it('checks ownership restrictions', async function() {

    // check for revert transaction of createVoting() & vote()
    // when msg.sender is not allowed account
    await expectRevert(instance.createVoting(bytesOfAddress[3], {from: accounts[9]}));
    await instance.createVoting(bytesOfAddress[3], {from: accounts[0]});
    await expectRevert(instance.vote(bytesOfAddress[3], accounts[0], true, {from: accounts[9]}));
  })


})
