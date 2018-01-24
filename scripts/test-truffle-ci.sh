#!/usr/bin/env bash
./node_modules/.bin/testrpc &
echo $! >> testrpc.pid
./node_modules/.bin/truffle test
kill -9 `cat testrpc.pid`
rm testrpc.pid