var ReputationGranter = artifacts.require('./ReputationGranter.sol')
var WriteAddressConfig = require('./lib/write-address-config.js');

module.exports = function (deployer) {
  deployer.deploy(ReputationGranter).then(() => {
    WriteAddressConfig.writeConfigFile(deployer.network, ReputationGranter);
  })
}
