#!/usr/bin/env bash
source ./scripts/env-testnet.sh

BOOTNODE_1_IP=`dig +short theserverbythe.stream | awk '{print $1}'`


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
  --bootnodes enode://68df974606fb67032ff513e7d54733d14f49783bd63c9469eb21c1c5422e898d581e880cbf0944a22ffea740f1d0ef70a3449a898bd6a81a8466de6b61146947@$BOOTNODE_1_IP:30303 \
  js ./scripts/mine.js
