#!/bin/bash
mkdir -p /root/scripts
cd /root/scripts
wget http://192.168.100.29/scripts/log-slave-delay.sh -O /root/scripts/log-slave-delay.sh
chmod +x /root/scripts/log-slave-delay.sh
echo "* * * * *		/root/scripts/log-slave-delay.sh" | crontab -

