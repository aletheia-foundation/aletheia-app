# for ubuntu 16.x

tested on ubuntu 16.10

```bash
  # geth
  sudo apt-get install software-properties-common
  sudo add-apt-repository -y ppa:ethereum/ethereum
  sudo apt-get update
  sudo apt-get install ethereum


  # ipfs
  snap install ipfs
  ipfs init

  # node 7.x from nodesource
  curl -sL https://deb.nodesource.com/setup_7.x | bash #todo shouldn't be doing this
  apt-get install nodejs

  # clone codebase
  git clone https://github.com/aletheia-foundation/aletheia-app
  pushd aletheia-app

  # start embark's geth miner
  chmod +x scripts/start-geth-testnet.sh
  ./scripts/start-geth-testnet.sh
```
