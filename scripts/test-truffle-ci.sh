#!/usr/bin/env bash
npm run ethereum-local &
echo $! >> testrpc.pid
./node_modules/.bin/truffle test
kill -9 `cat testrpc.pid`
rm testrpc.pid