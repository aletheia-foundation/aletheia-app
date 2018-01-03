var Aletheia = artifacts.require('./Aletheia.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')

module.exports = function (deployer) {
  deployer.deploy(Aletheia),
  deployer.deploy(Reputation)
}
