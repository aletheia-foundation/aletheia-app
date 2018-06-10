const Web3 = require('web3')
const contract = require('truffle-contract')
const aletheiaJson = require('../build/contracts/Aletheia.json')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const AletheiaContract = contract(aletheiaJson)
AletheiaContract.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
AletheiaContract.defaults({
  from: web3.eth.accounts[0],
  gas: "1000000"
})
async function go() {

  // setup web3
  const aletheiContract = await AletheiaContract.deployed()
  // Submit a paper for review from user 1
  const fileHashBytes1 = '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e1' //encoded ipfs address
  const fileHashBytes2 = '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e2' //encoded ipfs address
  const fileHashBytes3 = '0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e3' //encoded ipfs address
  const title = 'Test manuscript '
  const authors = [web3.eth.accounts[1]]
  const result1 = await aletheiContract.newManuscript(fileHashBytes1, title + 1, authors)
  const result2 = await aletheiContract.newManuscript(fileHashBytes2, title + 2, authors)
  const result3 = await aletheiContract.newManuscript(fileHashBytes3, title + 3, authors)
  aletheiContract.communityVote(fileHashBytes1, true, {from:web3.eth.accounts[2]})
  aletheiContract.communityVote(fileHashBytes1, true, {from:web3.eth.accounts[3]})
  aletheiContract.communityVote(fileHashBytes2, false, {from:web3.eth.accounts[2]})
  aletheiContract.communityVote(fileHashBytes2, false, {from:web3.eth.accounts[3]})
  //
  // for (var i = 0; i < 10; i++) {
  //   await new Promise((resolve,reject) => {
  //     web3.currentProvider.sendAsync({
  //       jsonrpc: "2.0",
  //       method: "evm_mine",
  //       id: 12345
  //     }, () => {
  //       resolve()
  //     });
  //   })
  // }

}

go().then((a)=>{
  console.log('done')
}).catch((e) => {
  console.error(e)
})


