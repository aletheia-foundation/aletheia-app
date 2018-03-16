var Aletheia = artifacts.require('./Aletheia.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')
var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')

module.exports = function (deployer) {
  return deployer.deploy(Aletheia, Reputation.address, ManuscriptIndex.address)
    .then(()=>{
      console.log('granting access to' + Aletheia.address)
      ManuscriptIndex.at(ManuscriptIndex.address).grantAccess(Aletheia.address).then((a)=>{
        console.log('aaaaa', JSON.stringify(a.logs))
      })
      Reputation.at(Reputation.address).grantAccess(Aletheia.address)
    })
};
