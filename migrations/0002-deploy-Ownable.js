var Accessible = artifacts.require('../contracts/Accessible.sol')

module.exports = function (deployer) {
  deployer.deploy(Accessible)
}
