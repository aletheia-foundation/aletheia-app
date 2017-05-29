TEST_DATA_DIR=.ethereum-test
if [ ! -d "$TEST_DATA_DIR" ]; then
  # Control will enter here if $DIRECTORY exists.
  ./scripts/init-testnet.sh
fi
geth --datadir $TEST_DATA_DIR --rpc --rpcapi eth,net,web3,personal --networkid 123 --nodiscover console
