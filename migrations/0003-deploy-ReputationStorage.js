var Reputation = artifacts.require('../contracts/Reputation.sol')

module.exports = function (deployer) {
  deployer.deploy(Reputation)
}
