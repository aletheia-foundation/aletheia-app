source ./scripts/env-testnet.sh
geth --datadir $TEST_DATA_DIR account list | awk -F[\{\}] '{print $2}' | xargs |  sed -e 's/ /,/g'
