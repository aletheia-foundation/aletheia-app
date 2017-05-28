geth --datadir .ethereum-test init config/test/genesis.json
geth --datadir .ethereum-test --rpc --rpcapi eth,net,web3,personal --networkid 123 --nodiscover console
