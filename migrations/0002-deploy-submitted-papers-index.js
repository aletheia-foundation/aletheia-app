var SubmittedPapersIndex = artifacts.require('./SubmittedPapersIndex.sol')
var WriteAddressConfig = require('./lib/write-address-config.js');

module.exports = function (deployer) {
  deployer.deploy(SubmittedPapersIndex)
  .then(() => {
    WriteAddressConfig.writeConfigFile(deployer.network, SubmittedPapersIndex);
  })
}
