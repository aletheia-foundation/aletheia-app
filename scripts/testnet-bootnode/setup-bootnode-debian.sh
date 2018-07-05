#!/bin/bash
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

# Allow jenkins-deployer to restart the service
sudo dd of=/var/aletheia-bootnode/restart-bootnode.sh << EOF
 systemctl restart aletheia-bootnode
EOF

sudo dd of=/etc/sudoers.d/aletheia-bootnode << EOF
%jenkins-deployer ALL= NOPASSWD: /var/aletheia-bootnode/restart-bootnode.sh
EOF

sudo chown -R aletheia-bootnode:bootnode-users /var/aletheia-bootnode
sudo chmod +x,g+x /var/aletheia-bootnode/restart-bootnode.sh
sudo chmod g+rwx /var/aletheia-bootnode
