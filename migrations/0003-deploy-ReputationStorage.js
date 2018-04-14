var Reputation = artifacts.require('../contracts/Reputation.sol')
var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')
var MinimalManuscript = artifacts.require('../contracts/MinimalManuscript.sol')

module.exports = function (deployer) {
  deployer.deploy(Reputation)
  deployer.deploy(ManuscriptIndex)
  deployer.deploy(CommunityVotes, 10)
  deployer.deploy(MinimalManuscript)
}
