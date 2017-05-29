# !/bin/bash
source ./scripts/env-testnet.sh

if [ -d "$TEST_DATA_DIR" ]; then
  rm -r $TEST_DATA_DIR
fi

# set up a local account
geth --datadir $TEST_DATA_DIR --password ./config/test/password account new

# get the account that was just generated
TESTNET_ACCOUNTS=`./scripts/get-testnet-addresses.sh`

# update the testnet config to make the account(s) start with ether
node ./scripts/add-balance-to-test-account.js $TESTNET_ACCOUNTS

# initialise the testnet chain
geth --datadir $TEST_DATA_DIR init build/genesis.json
