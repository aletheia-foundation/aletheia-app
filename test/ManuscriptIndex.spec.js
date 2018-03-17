const expectRevert = require('../test/helpers/expectRevert')
const expectThrow = require('../test/helpers/expectThrow')
const EncodingHelper = require('../test/helpers/test-encoding-helper')

console.log('*********', Object.keys(contract))

var ManuscriptIndex = artifacts.require('../contracts/ManuscriptIndex.sol')

contract('ManuscriptIndex', function(accounts) {
  var instance;
  var bytesOfAddress = [];
  var contractAddresses = []
  var elem2rm;
  // some test ipfs addresses
  bytesOfAddress[0] = EncodingHelper.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');
  bytesOfAddress[1] = EncodingHelper.ipfsAddressToHexSha256('QmdavdTfHgbbLCp5DUkZDYGoHwgDuQ2Zf2vpMYnJ6i71n2');
  bytesOfAddress[2] = EncodingHelper.ipfsAddressToHexSha256('QmWk4iniHmBZwpjwSFNmP7im4uEgVBgSFiPu2pU168353k');
  bytesOfAddress[3] = EncodingHelper.ipfsAddressToHexSha256('QmdxbPmxWus45myDDCXMfvyBnn5mLf2QsocKeVnDgxj2QR');
  bytesOfAddress[4] = EncodingHelper.ipfsAddressToHexSha256('QmRPCdKARctQAoooPfaxZWjSMPuzSEvzL44k3e7PPKtVib');
  bytesOfAddress[5] = EncodingHelper.ipfsAddressToHexSha256('QmT8f6vZRdorpsWzyiSighyR7XzyeATqwqtQwwv38KvgHn');

  contractAddresses[0] = '0x7d5a30189395a8b597676b232efc63bee5112816';
  contractAddresses[1] = '0xbbe93612468715e04c4810efd86d5e19b9082df3';
  contractAddresses[2] = '0x1ee892932fba13f097a5d61f86f52deffa6f9e3f';
  contractAddresses[3] = '0xb51b051f50e4b981cf915d1c8a668787d8f053fc';
  contractAddresses[4] = '0x70d3e00d16ac3abfdef782f66f299f252cbe34ab';
  contractAddresses[5] = '0xe6a90b0ced905d9934f2f3141182e4674279391f';

  it('add documents to storage', async function() {
    instance = await ManuscriptIndex.deployed();

    // give access to accounts[0]
    await instance.grantAccess(accounts[0]);

    // try to add empty document _hash
    await expectRevert(instance.add(0, 1));

    // try to add empty document address
    await expectRevert(instance.add(bytesOfAddress[0], 0));

    // check intial state of storage is only zero element
    assert.equal(await instance.dllIndex(0, true), 0,
      "next element to zero is not zero");
    assert.equal(await instance.dllIndex(0, false), 0,
      "previous element to zero is not zero");

    // add documents
    for(var cnt=0; cnt <bytesOfAddress.length; cnt++) {
      await instance.add(bytesOfAddress[cnt], cnt+1);
    }

    // check if documents have been added correctly
    var address1
    for(var cnt=0; cnt <bytesOfAddress.length; cnt++) {
      address1 = await instance.manuscriptAddress(bytesOfAddress[cnt]);
      assert.equal(address1, cnt+1, "added document address is not correct");
    }

    // try to add document twice
    await expectRevert(instance.add(bytesOfAddress[0], 2));

  })

  it('iterate from top to bottom through documents in storage', async function() {

    // read next (=true, prev=false) element of element zero in ring storage
    var current = await instance.dllIndex(0, true);

    // iterate through storage beginning at last added element
    var indexLength = 0;
    while(current != 0) {
      indexLength++;
      assert.equal(current, bytesOfAddress[bytesOfAddress.length-indexLength],
        "sequence of documents is not correct");
      current = await instance.dllIndex(current, true);
    }

    // check last element in storage to be zero
    assert.equal(current, 0, "last element is not zero");

    // check total number of elements (withou zero element)
    assert.equal(indexLength, bytesOfAddress.length,
      "number or elements in storage not correct");
  })

  it('iterate from bottom to top through documents in storage', async function() {

    // read prev (=false) element of element zero in ring storage
    var current = await instance.dllIndex(0, false);

    // iterate in reverse order through storage beginning at first added element
    var indexLength = 0;
    while(current != 0) {
      assert.equal(current, bytesOfAddress[indexLength],
        "reverse sequence of documents is not correct");
      current = await instance.dllIndex(current, false);
      indexLength++;
    }

    // check last element in storage to be zero
    assert.equal(current, 0, "last element is not zero");

    // check total number of elements (withou zero element)
    assert.equal(indexLength, bytesOfAddress.length,
      "number or elements in storage not correct");
  })

  it('remove document from storage', async function() {

    // set element for removal
    elem2rm = 3;

    // remove fourth element
    await instance.remove(bytesOfAddress[elem2rm]);

    // check if element was removed
    var address2 = await instance.manuscriptAddress(bytesOfAddress[elem2rm]);
    assert.equal(address2, 0, "document was not removed");

    // iterate trough storage and check if linking was changed to new sequence
    var current = await instance.dllIndex(0, true);
    var indexLength = 0;
    while(current != 0) {
      indexLength++;
      // conitnue with next iteration if removed element is compared with
      // corresponding element of bytesOfAddress
      if (bytesOfAddress.length-indexLength == elem2rm) {continue}
      assert.equal(current, bytesOfAddress[bytesOfAddress.length-indexLength],
        "sequence of documents is not correct");
      // check that also previous element is set correctly
      prevcurrent = current;
      current = await instance.dllIndex(current, true);
      assert.equal(await instance.dllIndex(current, false), prevcurrent,
        "revewerse linkin of documents is not correct");
    }
    // check last element in storage to be zero
    assert.equal(current, 0, "last element is not zero");

    // try to remove same element again
    await expectRevert(instance.remove(bytesOfAddress[elem2rm]));

    // try to remove zero element
    await expectRevert(instance.remove(0));
  })


  it('checks ownership restrictions', async function() {

    // check for revert transaction of add() & remove()
    // when msg.sender is not owner
    await expectRevert(instance.add(bytesOfAddress[elem2rm], 4, {from: accounts[1]}));
    await expectRevert(instance.remove(bytesOfAddress[0], {from: accounts[1]}));
  })


})
