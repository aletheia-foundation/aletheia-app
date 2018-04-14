const expectRevert = require('../test/helpers/expectRevert')

console.log('*********', Object.keys(contract))

var MinimalManuscript = artifacts.require('../contracts/MinimalManuscript.sol')
var ManuscriptFactory = artifacts.require('../contracts/ManuscriptFactory.sol')

contract('MinimalManuscript', function (accounts) {
  var global;
  var factory;
  // manuscript variables
  var manuscript = [];
  // manuscript address variables
  var addressManuscript = [];
  var bytesOfAddress = [];

  const initFactory = async function (contract) {
    var _factory = await contract.new(global.address);
    factory = {
      createManuscript: function (value1, value2, option) {
        return _factory.createManuscript(value1, value2, option)
          .then(tx => {
            return MinimalManuscript.at(tx.logs[0].args.newManuscriptAddress);
          })
      }
    }
  };

  before(async function() {
    global = await MinimalManuscript.new();
    await initFactory(ManuscriptFactory);
    // set data addresses of manuscripts
    // Todo: set different data addresses
    for (var cnt = 0; cnt < 4; cnt++) {
      bytesOfAddress[cnt] = '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6';
    }

    // create 4 minimal manuscripts manuscript[...] with adresses addressManuscript[...]
    // each manuscript has a different owner accounts[...]
    for (var cnt = 0; cnt < 4; cnt++) {
      manuscript[cnt] = await factory.createManuscript(bytesOfAddress[cnt],'title', {from: accounts[cnt]});
      addressManuscript[cnt] = await manuscript[cnt].address;
    }
  })

  it('creates manuscripts', async function(){
    // check data addresses
    for(var cnt=0; cnt<4; cnt++) {
      let tempBytesOfAdress = await manuscript[cnt].dataAddress();
      assert.equal(tempBytesOfAdress, bytesOfAddress[cnt], "data address is not correct")
    }
  })

  it('checks for revert transaction when data address is empty', async function(){
    await expectRevert(factory.createManuscript(0x00, 'title'));
  })

  it('checks for revert transaction when title is empty', async function(){
    await expectRevert(factory.createManuscript(0x1234, ''));
  })

  it('adds authors to manuscripts', async function() {

    // add authors to manuscript manuscript[0] and manuscript[1]
    await manuscript[0].addAuthor(accounts[1], {from: accounts[0]});
    await manuscript[0].addAuthor(accounts[2], {from: accounts[0]});
    await manuscript[1].addAuthor(accounts[3], {from: accounts[1]});
    await manuscript[1].addAuthor(accounts[4], {from: accounts[1]});
    await manuscript[1].addAuthor(accounts[5], {from: accounts[1]});

    // check authors
    let authorCnt1 = await manuscript[0].authorCount();
    for( var cnt = 0; cnt<authorCnt1; cnt++) {
      let authorMa1 = await manuscript[0].author(cnt);
      assert.equal(authorMa1, accounts[cnt+1], "author address is not in author list")
    }
    let authorCnt2 = await manuscript[1].authorCount();
    for( var cnt = 0; cnt<authorCnt2; cnt++) {
      let authorMa2 = await manuscript[1].author(cnt);
      assert.equal(authorMa2, accounts[cnt+3], "author address is not in author list")
    }
  })

  it('removes author', async function() {

    // remove author accounts[4] from manuscript manuscript[1]
    await manuscript[1].removeAuthor(accounts[4], {from: accounts[1]});

    // check if author count was reduced by one
    let authorCnt3 = await manuscript[1].authorCount();
    assert.equal(authorCnt3, 2, "author accounts[4] was not removed")

    // check if accounts[3] and accounts[5] are the only remaining authors
    let tempAuthor1 = await manuscript[1].author(0);
    assert.equal(tempAuthor1, accounts[3], "first author of manuscript manuscript[1] is not accounts[3]");
    let tempAuthor2 = await manuscript[1].author(1);
    assert.equal(tempAuthor2, accounts[5], "second author of manuscript manuscript[0] is not accounts[5]");

    // try to remove author which is not in author list of manuscript
    await expectRevert(manuscript[1].removeAuthor(accounts[6], {from: accounts[1]}));
  })

  it('cites papers', async function() {

    // check empty citation count of manuscript[0]
    let citationCnt1 = await manuscript[0].citationCount();
    assert.equal(citationCnt1, 0, "number of citations of manuscript manuscript[0] is not 0")

    // add 3 citations to manuscript[0]
    for( var cnt=1; cnt<4; cnt++) {
      await manuscript[0].citePaper(addressManuscript[cnt], {from: accounts[0]});
    }

    // verify succesfull citing
    let citationCnt2 = await manuscript[0].citationCount();
    assert.equal(citationCnt2, 3, "number of citations of manuscript manuscript[0] is not 3")
    for( var cnt=0; cnt<3; cnt++) {
      let tempCitation = await manuscript[0].citation(cnt);
      assert.equal(tempCitation, addressManuscript[cnt+1], "citation of manuscript is not correct");
    }

    // checks if double citation is impossible
    // cite manuscript manuscript[2] again
    await manuscript[0].citePaper(addressManuscript[2], {from: accounts[0]});
    // check if number of citations has changed.
    let citationCnt3 = await manuscript[0].citationCount();
    assert.equal(citationCnt3, 3, "double citation changed number of total citations")
  })

  it('removes citation', async function() {

    // remove citation manuscript[2] from manuscript manuscript[0]
    await manuscript[0].removeCitation(addressManuscript[2], {from: accounts[0]});

    // check if citation count was reduced by one
    let citationCnt4 = await manuscript[0].citationCount();
    assert.equal(citationCnt4, 2, "citation of manuscript[2] was not removed")

    // check if only citation of manuscript[1] and manuscript[3] remained
    let tempCitation1 = await manuscript[0].citation(0);
    assert.equal(tempCitation1, addressManuscript[1], "first citation of manuscript manuscript[0] is not manuscript[1]");
    let tempCitation2 = await manuscript[0].citation(1);
    assert.equal(tempCitation2, addressManuscript[3], "second citation of manuscript manuscript[0] is not manuscript[3]");

    // try to remove citation which is not in citation list of manuscript
    await expectRevert(manuscript[0].removeCitation(addressManuscript[2], {from: accounts[0]}));
  })

  it('signs authorship', async function(){

    // sign authorhip of manuscript
    await manuscript[0].signAuthorship({from: accounts[1]});

    // check if authorship was signed corretly
    let authorSigned = await manuscript[0].signedByAuthor(accounts[1]);
    assert.equal(authorSigned, true, "accounts[1] did not sign manuscript manuscript[0]")

    // try to sign manuscript without having authorship
    await expectRevert(manuscript[0].signAuthorship({from: accounts[3]}));
  })


  it('checks ownership restrictions', async function() {

    // check for revert transaction of addAuthor() when msg.sender is not owner
    await expectRevert(manuscript[0].addAuthor(accounts[3], {from: accounts[1]}));

    // check for revert transaction of citePaper() when msg.sender in not owner
    await expectRevert(manuscript[0].citePaper(addressManuscript[3], {from: accounts[1]}));

    // check for revert transaction of removeCitation() when msg.sender in not owner
    await expectRevert(manuscript[0].removeCitation(addressManuscript[1], {from: accounts[1]}));

    // check for revert transaction of removeAuthor() when msg.sender in not owner
    await expectRevert(manuscript[0].removeAuthor(accounts[2], {from: accounts[1]}));
  })
})
