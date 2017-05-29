// usage `node add-balance-to-test-accounts.js [ADDRESS1] ... [ADDRESSN]`
const fs = require('fs')
const genesisJson = require('../config/test/genesis.json')
const addressesToCredit = process.argv[2].split(',')
const ammountToCreditInWei = '1000000000000000000000'
console.log(`crediting ${ammountToCreditInWei} to accounts: ${addressesToCredit}`)

for (var i = 0; i < addressesToCredit.length; i++) {
  genesisJson.alloc[addressesToCredit[i]] = {'balance': ammountToCreditInWei}
}

fs.writeFileSync('build/genesis.json', JSON.stringify(genesisJson))
