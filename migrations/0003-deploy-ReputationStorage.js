var Reputation = artifacts.require('../contracts/Reputation.sol')
var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')

module.exports = function (deployer) {
  deployer.deploy(Reputation)
  deployer.deploy(ManuscriptIndex)
}
