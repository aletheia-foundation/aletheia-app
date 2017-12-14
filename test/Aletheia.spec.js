const EncodingHelper = require('../app/common/encoding-helper')
const expectThrow = require('../test/helpers/expectThrow')

console.log('*********', Object.keys(contract))

var Aletheia = artifacts.require('../contracts/Aletheia.sol')

contract('Aletheia', function (accounts) {

  it('will register paper', async function() {
    var instance = await Aletheia.deployed();

  })

})
