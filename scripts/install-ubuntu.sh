# install nodejs 6.x from nodesource
curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
sudo sh -c "echo 'deb https://deb.nodesource.com/node_6.x xenial main' > \
    /etc/apt/sources.list.d/nodesource.list"
sudo apt-get update

sudo apt-get install -y nodejs
# and create an alias in your .bash_profile: alias node=nodejs


# add ethereum repo and install geth (ethereum).
# note, this is not strictly required for local development as the fake ethereum client `testrpc` can be used.
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get install -y software-properties-common # required by geth
sudo apt-get update
sudo apt-get install ethereum -y

# easiest is with the snap package manager https://github.com/ipfs/go-ipfs#build-from-source
# unfortunately ipfs is not available within apt or yum yet.
sudo apt-get install -y snapd
sudo snap install -y ipfs

npm install -g electron
