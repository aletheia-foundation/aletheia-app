const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')

console.log('*********', Object.keys(contract))

var Aletheia = artifacts.require('../contracts/Aletheia.sol')
var MinimalManuscript = artifacts.require('../contracts/MinimalManuscript.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')

contract('Aletheia', function(accounts) {
  var instance, instanceRep, instanceVotes;
  var addressManuscript1;
  var manuscript1;
  var bytesOfAddress = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');

  it('transfer ownership of reputation contract to Aletheia', async function() {

    instanceRep = await Reputation.deployed();
    instance = await Aletheia.deployed();
    instanceVotes = await CommunityVotes.deployed();

    await instanceRep.grantAccess(instance.address, {from: accounts[0]});
    await instanceVotes.grantAccess(instance.address, {from: accounts[0]});

    // check allowance for reputation of Aletheia contract
    var ownerRep = await instanceRep.allowedAccounts(instance.address);
    assert.equal(ownerRep, true, "new owner is not Aletheia")

    // check allowance for communtiyvotes of Aletheia contract
    var ownerVote = await instanceVotes.allowedAccounts(instance.address);
    assert.equal(ownerVote, true, "new owner is not Aletheia")
  })

  it('create new manuscripts', async function() {
    // create new manuscript 1
    await instance.newManuscript(bytesOfAddress, {from: accounts[0]});

    // get address of new contact by IPFS link
    addressManuscript1 = await instance.manuscriptAddress(bytesOfAddress);
    manuscript1 = await MinimalManuscript.at(addressManuscript1);

    // check for transfer of ownership for new manuscript
    let ownerManuscript1 = await manuscript1.isOwner(accounts[0]);
    assert.equal(ownerManuscript1, true, "new owner is not author 1");
  })

  it('add author to manuscript', async function() {

    await manuscript1.addAuthor(accounts[1], {from: accounts[0]})
  })

  it('register new manuscript', async function() {
    // register manuscript
    await instance.registerPaper(addressManuscript1, {from: accounts[0]});

    // check for revert transaction when registerPaper() is not used by
    // manuscript owner
    await expectRevert(instance.registerPaper(addressManuscript1, {from: accounts[1]}));
    await expectRevert(instance.registerPaper(addressManuscript1, {from: accounts[2]}));
  })

  it('vote for and against manuscript', async function() {

    // try to vote for manuscript as manuscript owner
    await expectRevert(instance.communityVote(bytesOfAddress, true, {from: accounts[0]}));

    // try to vote for manuscript as manuscript author
    await expectRevert(instance.communityVote(bytesOfAddress, true, {from: accounts[1]}));

    // vote for manuscript
    var nClosed = 0;
    for(var cnt=0; cnt<7; cnt++) {
      // vote 3 times for manuscript then against it
      var nForVote = 5;
      if (cnt+2 < nForVote) {var vote = true} else {var vote = false}
      // check that voting is still open
      if (await instanceVotes.votingActive(bytesOfAddress) > 1 ) {
        // vote
        await instance.communityVote(bytesOfAddress, vote, {from: accounts[cnt+2]});
      }
      else {
        // save cnt when voting was closed
        if (nClosed == 0) {nClosed = cnt};
        // try to vote
        await expectRevert(instance.communityVote(bytesOfAddress, vote, {from: accounts[cnt+2]}));
      }
    }

    // check that voting is closed
    assert.equal(await instanceVotes.votingActive(bytesOfAddress), 0 ,
      "voting is not closed");

    // check that manuscript was accepted
    var nVoters = await instanceVotes.getVoting(bytesOfAddress);
    assert(nVoters[1] > nVoters[2].length-nVoters[1], "manuscript was not accepted");

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
