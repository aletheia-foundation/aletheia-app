var Reputation = artifacts.require('../contracts/Reputation.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')

module.exports = function (deployer) {
  deployer.deploy(Reputation)
  deployer.deploy(CommunityVotes,8)
}
