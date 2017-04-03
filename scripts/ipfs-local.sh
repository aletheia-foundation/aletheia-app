#!/bin/bash

IPFS_DIR='.ipfs-develop'
if [ ! -d "$IPFS_DIR" ]; then
  # Control will enter here if $DIRECTORY exists.
  ipfs init -c $IPFS_DIR
fi
ipfs daemon -c $IPFS_DIR
