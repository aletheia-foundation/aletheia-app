# !/bin/bash
source ./scripts/env-testnet.sh

if [ -d "$TEST_DATA_DIR" ]; then
  rm -r $TEST_DATA_DIR
fi

if [ -f "$TEST_NET_PASSWORD" ]; then
  rm -f $TEST_NET_PASSWORD
fi

randomUtf8=$(head -c 64 /dev/urandom | base64)
(umask 377 ; echo $randomUtf8 > "$TEST_NET_PASSWORD")

# set up a local account
geth --datadir $TEST_DATA_DIR --password $TEST_NET_PASSWORD account new

# get the account that was just generated
TESTNET_ACCOUNTS=`./scripts/get-testnet-addresses.sh`

# update the testnet config to make the account(s) start with ether
node ./scripts/add-balance-to-test-account.js $TESTNET_ACCOUNTS

# initialise the testnet chain
geth --datadir $TEST_DATA_DIR init build/genesis.json
