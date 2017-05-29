![alt tag](https://cloud.githubusercontent.com/assets/24201238/24583976/ced4c43e-179f-11e7-9c40-c0988c346f55.png)

_**Publish science for free, access science for free.**_

Aletheia client using IPFS and Electron

# Requirements

* Nodejs 6+
* A running local IPFS node
* A running ethereum node. Recommended to use `testrpc` for local development and `geth` for the testnet

## OSX instructions
```bash
  # note, this is not strictly required for local development as the fake ethereum client `testrpc` can be used.
  brew install ethereum # installs geth
  brew install ipfs
  brew install nodejs
  npm install -g electron
```

## Ubuntu instructions

These instructions were tested on ubuntu 16.10

```bash
  #this installs nodejs 6.x, geth, ipfs and electron
  sudo ./scripts/ubuntu-install.sh
```

# Run project

Clone this repo and cd into its directory

This project requires IPFS and Ethereum clients to be running in the background

```bash
  # open three terminal tabs in the project folder:
  # in tab 1
  npm install
  npm start # (app will start but be unable to connect to filesharing or blockchain)

  # in tab 2 (must be in project directory)
  npm run ipfs-local

  # in tab 3 (must be in project directory)
  npm run ethereum-local
```

# Tests

Tests require IPFS and Ethereum clients to be running in the background
```bash
  # while `npm run ethereum-local` and `npm run ethereum-local` are running in two other tabs:
  npm test
```

# code style

Project uses the Javascript standard style
