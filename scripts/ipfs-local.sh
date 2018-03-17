#!/usr/bin/env bash
IPFS_EXECUTABLE='./node_modules/go-ipfs-dep/go-ipfs/ipfs'

IPFS_DIR='.ipfs-develop'
if [ ! -d "$IPFS_DIR" ]; then
  # Control will enter here if $DIRECTORY exists.
  IPFS_EXECUTABLE init -c $IPFS_DIR
fi
IPFS_EXECUTABLE daemon -c $IPFS_DIR
