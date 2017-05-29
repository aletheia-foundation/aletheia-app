![alt tag](https://cloud.githubusercontent.com/assets/24201238/24583976/ced4c43e-179f-11e7-9c40-c0988c346f55.png)

_**Publish science for free, access science for free.**_

Aletheia client using IPFS and Electron

# Requirements

* A running local IPFS node
* A running ethereum node. Recommended to use `testrpc` for local development and `geth` for the testnet

## OSX instructions
```bash
  brew install ethereum # installs geth
  brew install ipfs
  brew install nodejs
  npm install -g electron
```


## Ubuntu instructions
```bash
  sudo apt install nodejs
  # and create an alias in your .bash_profile: alias node=nodejs
  sudo apt-get install software-properties-common # required by geth

  # add ethereum repo and install geth (ethereum).
  sudo add-apt-repository -y ppa:ethereum/ethereum
  sudo apt-get update
  sudo apt-get install ethereum -Y

  # easiest is with the snap package manager https://github.com/ipfs/go-ipfs#build-from-source
  sudo snap install ipfs

  npm install -g electron
```

# Run project

Clone this repo and cd into its directory

## Run locally

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
