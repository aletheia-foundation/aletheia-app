var Reputation = artifacts.require('../contracts/Reputation.sol')
var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')
var MinimalManuscript2 = artifacts.require('../contracts/MinimalManuscript2.sol')

module.exports = function (deployer) {
  deployer.deploy(Reputation)
  deployer.deploy(ManuscriptIndex)
  deployer.deploy(CommunityVotes, 10)
}
