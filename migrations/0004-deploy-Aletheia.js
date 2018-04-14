var Aletheia = artifacts.require('./Aletheia.sol')
var Reputation = artifacts.require('../contracts/Reputation.sol')
var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')
var CommunityVotes = artifacts.require('../contracts/CommunityVotes.sol')
var MinimalManuscript2 = artifacts.require('../contracts/MinimalManuscript2.sol')
var ManuscriptFactory = artifacts.require('../contracts/ManuscriptFactory.sol')

module.exports = function (deployer) {
  return deployer.deploy(Aletheia, Reputation.address,ManuscriptIndex.address, CommunityVotes.address)
    .then(()=>{
      console.log('granting access to' + Aletheia.address)
      Reputation.at(Reputation.address).grantAccess(Aletheia.address)
      ManuscriptIndex.at(ManuscriptIndex.address).grantAccess(Aletheia.address)
      CommunityVotes.at(CommunityVotes.address).grantAccess(Aletheia.address)
    })
};
