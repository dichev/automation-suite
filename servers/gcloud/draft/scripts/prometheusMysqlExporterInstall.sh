#!/bin/bash

set -e

wget https://github.com/prometheus/mysqld_exporter/releases/download/v0.11.0/mysqld_exporter-0.11.0.linux-amd64.tar.gz
tar xzf mysqld_exporter-0.11.0.linux-amd64.tar.gz
mv mysqld_exporter-0.11.0.linux-amd64/mysqld_exporter /usr/local/bin/
chmod +x /usr/local/bin/mysqld_exporter

(
cat << EOF
[Unit]
Description=Prometheus MySQL Exporter
After=network.target

[Service]
User=root
Group=root
Type=simple
ExecStart=/usr/local/bin/mysqld_exporter
Restart=always

[Install]
WantedBy=multi-user.target

EOF
) > /etc/systemd/system/mysqld_exporter.service

systemctl daemon-reload
systemctl enable mysqld_exporter.service
systemctl start mysqld_exporter.service

iptables -I INPUT -p tcp -s 0.0.0.0/0 --dport 9104 -j DROP
iptables -I INPUT -p tcp -s 192.168.100.64 --dport 9104 -j ACCEPT
iptables -I INPUT -p tcp -s 192.168.100.65 --dport 9104 -j ACCEPT
iptables -I INPUT -p tcp -s 192.168.100.14 --dport 9104 -j ACCEPT
iptables-save
