const EncodingHelper = require('../app/common/encoding-helper')
const expectRevert = require('../test/helpers/expectRevert')


console.log('*********', Object.keys(contract))

var MinimalManuscript2 = artifacts.require('../contracts/MinimalManuscript2.sol')
var ManuscriptFactory = artifacts.require('../contracts/ManuscriptFactory.sol')

contract('ManuscriptFactory', function (accounts) {
  var global;
  var factory;
  // manuscript variables
  var manuscript = [];
  // manuscript address variables
  var addressManuscript = [];
  var instanceMaFactory;
  var bytesOfAddress = [], ipfsAddress = [];
  ipfsAddress[0] = 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH';
  ipfsAddress[1] = 'QmdavdTfHgbbLCp5DUkZDYGoHwgDuQ2Zf2vpMYnJ6i71n2';
  ipfsAddress[2] = 'QmWk4iniHmBZwpjwSFNmP7im4uEgVBgSFiPu2pU168353k';
  ipfsAddress[3] = 'QmdxbPmxWus45myDDCXMfvyBnn5mLf2QsocKeVnDgxj2QR';
  ipfsAddress[4] = 'QmRPCdKARctQAoooPfaxZWjSMPuzSEvzL44k3e7PPKtVib';
  ipfsAddress[5] = 'QmT8f6vZRdorpsWzyiSighyR7XzyeATqwqtQwwv38KvgHn';
  for(var cnt=0; cnt<ipfsAddress.length; cnt++) {
    bytesOfAddress[cnt] = EncodingHelper.ipfsAddressToHexSha256(ipfsAddress[cnt]);
  }

  const initFactory = async function (contract) {
    var _factory = await contract.new(global.address);
    factory = {
      cloneCost: function() {
        return _factory.onlyCreate().then(tx => tx.receipt.gasUsed);
      },
      createManuscript: function (value, option) {
        return _factory.createManuscript(value, option)
          .then(tx => {
            return MinimalManuscript2.at(tx.logs[0].args.newManuscriptAddress);
          })
      }
    }
  };

  before(async function () {
    global = await MinimalManuscript2.new();
    await initFactory(ManuscriptFactory);
  })

  it('check low gas consumption', async function() {

    var cost = await factory.cloneCost();
    console.log("    Clone cost: " + cost);
    assert(cost < 70000,"clone cost is not below 70000")
  })

  it('create new cheap manuscript ', async function() {

    manuscript[0] = await factory.createManuscript(bytesOfAddress[0]);
    assert.equal(await manuscript[0]._dataAddress(), bytesOfAddress[0], "manuscript address is not correct" );
    assert.equal(await global._dataAddress(), 0x1, "address of master contract is not 0x1")
  })

  it('check ownership of new manuscripts', async function() {

    manuscript[1] = await factory.createManuscript(bytesOfAddress[0], {from: accounts[1]});
    assert.equal(await manuscript[1].owner(), accounts[1], "owner is not correct" );
  })

  it('check for false input to ManuscriptFactory', async function() {

    await expectRevert(factory.createManuscript(0))
  })

  it('check revert of init master contract & other existing contract', async function() {

    await expectRevert(global.init(2, accounts[0]))
    await expectRevert(manuscript[0].init(2, accounts[2]))
  })

  it('check that directly created manuscripts are dead', async function() {
    
    manuscript[2] = await MinimalManuscript2.new({from: accounts[1]});
    assert.equal(await manuscript[2].owner(), accounts[1], 'owner not correct');
    await expectRevert(manuscript[2].init(bytesOfAddress[2], accounts[3]));
  })

})
