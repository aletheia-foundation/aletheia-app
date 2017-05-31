#!/bin/bash
source ./scripts/env-testnet.sh

# Even if we are not the admin(rich) node,
# still init the network with the same genesis.json to make networks compatible
if [ ! -d  $TEST_DATA_DIR ]; then
  geth --datadir $TEST_DATA_DIR init build/genesis.json
fi

if [ ! -f "$TEST_NET_PASSWORD" ]; then
  randomUtf8=$(head -c 64 /dev/urandom | base64)
  (umask 377 ; echo $randomUtf8 > "$TEST_NET_PASSWORD")
fi

TESTNET_ACCOUNTS=`./scripts/get-testnet-addresses.sh`

if [ -z "$TESTNET_ACCOUNTS" ]; then
  geth --datadir $TEST_DATA_DIR --password $TEST_NET_PASSWORD account new
fi

TESTNET_ACCOUNTS=`./scripts/get-testnet-addresses.sh`

geth --datadir $TEST_DATA_DIR --rpc --rpcapi eth,net,web3,personal \
  --networkid 123039281 --password $TEST_NET_PASSWORD \
  --unlock $TESTNET_ACCOUNTS \
  --bootnodes enode://66285a935996d546dda3895b75dc6d25d053aa0d69570f991c8f69c2372c6c9686e3c06d6cc9f0b03905c702d48dc402f50986044611dc8f808eef5cd038b419@139.59.126.46:30303 \
  js ./scripts/mine.js
