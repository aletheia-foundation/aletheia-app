geth --datadir .ethereum_private init contracts/genesis.json

geth --fast --rpc --cache 512 --ipcpath ~/Library/Ethereum/geth.ipc --networkid 1234 --datadir .ethereum_private  console
