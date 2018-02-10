var Aletheia = artifacts.require('./Aletheia.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')

module.exports = function (deployer) {
   deployer.deploy(Aletheia, Reputation.address);
   deployer.deploy(Aletheia, CommunityVotes.address)
};
