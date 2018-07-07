#!/usr/bin/env bash
source ./scripts/env-testnet.sh

BOOTNODE_1_IP=`dig +short aletheia-infrastructure.org | awk '{print $1}'`


# Even if we are not the admin(rich) node,
# still init the network with the same genesis.testnet.json to make networks compatible
if [ ! -d  $TEST_DATA_DIR ]; then
  geth --datadir $TEST_DATA_DIR init ./build/genesis.testnet.json
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
  --unlock "$TESTNET_ACCOUNTS" \
  --bootnodes enode://682e65fffd55107fcc4ace95aca52ee9a06fe28507610a47a2c9c9c2e28175ca06b462085f6e845d209619ee5a26b597c4c9504da243c4a6503f8d5fa07b8175@$BOOTNODE_1_IP:30303 \
  js ./scripts/mine.js
