geth --datadir .ethereum_private init contracts/genesis.json

geth --fast --rpc --rpcapi eth,net,web3,personal --cache 512 --datadir .ethereum_private  console
