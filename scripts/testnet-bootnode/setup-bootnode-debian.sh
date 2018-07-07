#!/bin/bash
# This assumes that a [jenkins-deployer user is setup](https://github.com/aletheia-foundation/jenkins)

# install geth
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get install -y software-properties-common # required by geth
sudo apt-get update
sudo apt-get install ethereum -y

# This assumes that a [jenkins-deployer user is setup](https://github.com/aletheia-foundation/jenkins)
# User and directory ownership
sudo useradd -m aletheia-bootnode
sudo groupadd bootnode-users
sudo usermod -a -G bootnode-users jenkins-deployer
sudo usermod -a -G bootnode-users aletheia-bootnode

sudo mkdir /var/aletheia-bootnode

# Add service restart script

# Setup service
sudo dd of=/etc/systemd/system/aletheia-bootnode.service << EOF
[Service]
ExecStart=/var/aletheia-bootnode/bootnode/scripts/start-geth-testnet.sh
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=aletheia-bootnode
User=aletheia-bootnode
Group=aletheia-bootnode
WorkingDirectory=/var/aletheia-bootnode/bootnode/

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable aletheia-bootnode.service

# Allow jenkins-deployer to restart the service
sudo dd of=/var/aletheia-bootnode/restart-bootnode.sh << EOF
 chmod +x /var/aletheia-bootnode/bootnode/scripts/start-geth-testnet.sh
 systemctl restart aletheia-bootnode
EOF

sudo dd of=/etc/sudoers.d/aletheia-bootnode << EOF
%jenkins-deployer ALL= NOPASSWD: /var/aletheia-bootnode/restart-bootnode.sh
EOF

sudo chown -R aletheia-bootnode:bootnode-users /var/aletheia-bootnode
sudo chmod +x,g+x /var/aletheia-bootnode/restart-bootnode.sh

sudo chmod g+rwxs /var/aletheia-bootnode
