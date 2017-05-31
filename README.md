![alt tag](https://cloud.githubusercontent.com/assets/24201238/24583976/ced4c43e-179f-11e7-9c40-c0988c346f55.png)

_**Publish science for free, access science for free.**_

Downloadable Aletheia App

# About

todo:
* Link to project docs
* decentralisation
* why a downloadable app

* Ethereum
[Ethereum](https://www.ethereum.org/) is a blockchain technology for agreeing on data and logic in a completely decentralised way. Ethereum will be used to manage rules about which documents are approved by the network. Ethereum uses [solidity](https://solidity.readthedocs.io/en/develop/) smart contracts which are stored in the `/contracts` directory.
* Truffle
[Truffle](http://truffleframework.com/) is a framework for developing, testing and deploying Ethereum contracts.
* Filesharing
[IPFS](https://ipfs.io/) is a peer to peer filesharing technology similar to bittorrent. A core aspect of aletheia will be a private ipfs network which shares only the files which have been approved by the community. Currently we simply use the public IPFS network to share files.

* Livenet vs Testnet vs Development
Despite using the Ethereum code, we do not have to use the main ethereum blockchain. To keep costs down we plan on going live with a sperate blockchain.
For local development, a blockchain can be faked using [testrpc](https://github.com/ethereumjs/testrpc). For public testing a testnet is being deployed for testing interactions between multiple aletheia clients.

* Electron
[Electron](https://electron.atom.io/) is a framework for developing cross platform applications with HTML and JavaScript. `main.js` bootstraps the app, each page is then self contained within the `./app` directory. In future we may add a javascript UI framework such as react or angular.

# Requirements

* Nodejs 6+
* A running local IPFS node
* A running ethereum node. Recommended to use `testrpc` for local development and `geth` for the testnet

## OSX instructions
```bash
  git clone https://github.com/aletheia-foundation/aletheia-app.git
  cd aletheia-app

  # note, this is not strictly required for local development as the fake ethereum client `testrpc` can be used.
  brew install ethereum # installs geth
  brew install ipfs
  brew install nodejs
  npm install -g electron

```

## Ubuntu instructions

These instructions were tested on ubuntu 16.10

```bash
  git clone https://github.com/aletheia-foundation/aletheia-app.git
  cd aletheia-app
  # this installs nodejs 6.x, geth, ipfs and electron
  sudo ./scripts/install-ubuntu.sh
```

# Run project

Clone this repo and cd into its directory

This project requires IPFS and Ethereum clients to be running in the background

```bash
  # open three terminal tabs in the project folder:
  # in tab 1
  npm install
  npm run ethereum-local

  # in tab 2 (must be in project directory)
  npm run ipfs-local

  # in tab 3 (must be in project directory)
  npm start # (app will start but be unable to connect to filesharing or blockchain)
```

# Tests

Tests require IPFS and Ethereum clients to be running in the background
```bash
  # while `npm run ethereum-local` and `npm run ethereum-local` are running in two other tabs:
  npm test
```

# code style

Project uses the Javascript standard style
