const expectRevert = require('../test/helpers/expectRevert')

console.log('*********', Object.keys(contract))

var Aletheia = artifacts.require('../contracts/Aletheia.sol')
var MinimalManuscript = artifacts.require('../contracts/MinimalManuscript.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')
var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')

contract('Aletheia', function(accounts) {
  var instance, instanceRep, instanceVotes, instanceManscptInd;
  var addressManuscript1;
  var manuscript1;
  var bytesOfAddress = '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6'

  before(async function() {
    instanceRep = await Reputation.deployed();
    instanceManscptInd = await ManuscriptIndex.deployed();
    instanceVotes = await CommunityVotes.deployed();
    instance = await Aletheia.deployed();
  })

  it('transfer ownership of reputation contract to Aletheia', async function() {
    // check new owner of reputation
    var ownerRep = await instanceRep.allowedAccounts(instance.address);
    assert.equal(ownerRep, true, "new owner is not Aletheia")

    // check new owner of manuscriptIndex
    var ownerManscptInd = await instanceManscptInd.allowedAccounts(instance.address);
    assert.equal(ownerManscptInd, true, "new owner is not Aletheia")

    // check allowance for communtiyvotes of Aletheia contract
    var ownerVote = await instanceVotes.allowedAccounts(instance.address);
    assert.equal(ownerVote, true, "new owner is not Aletheia")

  })

  describe('create new manuscripts', function() {
    before(async function() {
      // create new manuscript 1
      await instance.newManuscript(bytesOfAddress, 'the title', [accounts[0]], {from: accounts[0]});

      // get address of new contact by IPFS link
      addressManuscript1 = await instanceManscptInd.manuscriptAddress(bytesOfAddress);
      manuscript1 = await MinimalManuscript.at(addressManuscript1);

    })

    it('should transfer ownership of new manuscript to the creator', async function() {
      // check for transfer of ownership for new manuscript
      let ownerManuscript1 = await manuscript1.isOwner(accounts[0]);
      assert.equal(ownerManuscript1, true, "new owner is not author 1");
    })

    it('checks ownership restrictions', async function() {

      // check for revert transaction of remove() when msg.sender is not owner
      await expectRevert(instance.remove({from: accounts[1]}));
    })

    describe('add author to manuscript', async function() {
      before(async function() {
        await manuscript1.addAuthor(accounts[1], {from: accounts[0]})
      })

      it('vote for and against manuscript', async function() {

        // try to vote for manuscript as manuscript owner
        await expectRevert(instance.communityVote(bytesOfAddress, true, {from: accounts[0]}));

        // try to vote for manuscript as manuscript author
        await expectRevert(instance.communityVote(bytesOfAddress, true, {from: accounts[1]}));

        // vote for manuscript
        var nClosed = 0;
        for(var cnt=0; cnt<7; cnt++) {
          // vote 4 times for manuscript then against it
          var nForVote = 4;
          if (cnt < nForVote) {var vote = true} else {var vote = false}
          // check that voting is still open

          if (await instanceVotes.votingActive(bytesOfAddress) > 0 ) {
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
    })
  })
})
