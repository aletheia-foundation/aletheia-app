source ./scripts/env-testnet.sh

TESTNET_ACCOUNTS=`./scripts/get-testnet-addresses.sh`

if [ ! -z "$TESTNET_ACCOUNTS" ]; then
  geth --datadir $TEST_DATA_DIR --rpc --rpcapi eth,net,web3,personal \
      --networkid 123 --nodiscover  --password ./config/test/password \
      --unlock $TESTNET_ACCOUNTS \
      --mine
fi
