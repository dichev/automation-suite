#!/bin/bash
#

# sofia-system IP list
SSIP="192.168.110.29
192.168.100.29"

for ipaddr in $SSIP; do
  ping -c 1 -w 3 $ipaddr > /dev/null
    if [[ $? -eq 0 ]]; then
      echo "Connecting to $ipaddr"
      wget -O -  http://$ipaddr/scripts/fix-dns.sh | bash
      break
    else
      echo "Can't connect to $ipaddr"
  fi
done

ssh-keyscan -H gitlab.in >> ~/.ssh/known_hosts
ssh-keyscan -H gitlab.dopamine.bg >> ~/.ssh/known_hosts
ssh-keyscan -H monitoring.d >> ~/.ssh/known_hosts

apt-get update
apt-get -y install curl git
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get -y install nodejs
