var Aletheia = artifacts.require('./Aletheia.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')
var MinimalManuscript2 = artifacts.require('../contracts/MinimalManuscript2.sol')
var ManuscriptFactory = artifacts.require('../contracts/ManuscriptFactory.sol')

module.exports = function (deployer) {
   deployer.deploy(Aletheia, Reputation.address, CommunityVotes.address)
   deployer.deploy(ManuscriptFactory, MinimalManuscript2.address)
};
