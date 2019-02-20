#!/bin/bash
#
# Prometheus node exporter install script
#

### Install
wget -qO- https://monitoring2/scripts/node_exporter-0.16.0.linux-amd64.tar.gz --no-check-certificate | tar xz
mv node_exporter-0.16.0.linux-amd64/node_exporter /usr/local/bin/
rm -rf node_exporter-0.16.0.linux-amd64

### Create user
useradd -rs /bin/false node_exporter

### systemd service
(
cat << EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target

EOF
) > /etc/systemd/system/node_exporter.service

### Service start
systemctl daemon-reload
systemctl enable node_exporter.service
systemctl start node_exporter.service

### Security
iptables -I INPUT -p tcp -s 0.0.0.0/0 --dport 9100 -j DROP
iptables -I INPUT -p tcp -s 192.168.100.64 --dport 9100 -j ACCEPT
iptables -I INPUT -p tcp -s 192.168.100.65 --dport 9100 -j ACCEPT

iptables-save
