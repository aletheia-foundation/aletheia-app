var Reputation = artifacts.require('../contracts/Reputation.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')
var MinimalManuscript2 = artifacts.require('../contracts/MinimalManuscript2.sol')

module.exports = function (deployer) {
  deployer.deploy(Reputation)
  deployer.deploy(CommunityVotes,10)
  deployer.deploy(MinimalManuscript2,0x01)
}
