#!/bin/bash
source ./scripts/env-testnet.sh

# Even if we are not the admin(rich) node,
# still init the network with the same genesis.json to make networks compatible
if [ ! -d  $TEST_DATA_DIR ]; then
  geth --datadir $TEST_DATA_DIR init ./build/genesis.json
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
  --bootnodes enode://41dbef7eac7931f4249e8bdd2fbf31255b15bbc6b9836afe156593b401ac4a2c139028e422efe1e63008aba954e434fc1f93c92abd7fd69c28daec9976aa093b@127.0.0.1:30303 \
  js ./scripts/mine.js
