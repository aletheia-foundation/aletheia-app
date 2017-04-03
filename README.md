![alt tag](https://cloud.githubusercontent.com/assets/24201238/24583976/ced4c43e-179f-11e7-9c40-c0988c346f55.png)

_**Publish science for free, access science for free.**_

Aletheia client using IPFS and Electron

# Requirements

A running local IPFS node
The `geth` ethereum client installed on your path

## OSX instructions
```bash
  brew install ethereum # requires geth
  brew install ipfs #or install ipfs for your platform
  ipfs daemon
```

## Ubuntu instructions
```bash
  sudo apt install nodejs # and create an alias node=nodejs
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
```bash
  npm install
  npm start
  # this project relies on ipfs and an ethereum client running in the background.
```

Start geth(via embark CLI) and ipfs in background processes
```bash
  # in bash 1, in the project directory
  ./node_modules/.bin/embark blockchain
  # in bash 2
  ipfs daemon
```

# tests
```bash
  mocha
```
