#!/bin/bash

# monitoring2 IP list
MON2="192.168.110.36
192.168.100.36"

for ipaddr in $MON2; do
  ping -c 1 -w 3 $ipaddr > /dev/null
    if [[ $? -eq 0 ]]; then
      echo "Setting monitoring2 to $ipaddr"
      MON2LINE="$ipaddr monitoring2"
      break
    else
      echo "No ping to $ipaddr"
  fi
 done
echo "Creating /etc/hosts backup"
mv /etc/hosts /etc/hosts.back
echo "Updating /etc/hosts"
cat /etc/hosts.back | grep -v monitoring2 > /etc/hosts
echo $MON2LINE >> /etc/hosts

# Installing https transport for apt
apt-get update --allow-unauthenticated
apt-get -y install apt-transport-https curl lsb-release --allow-unauthenticated

# Icinga repository for the exact Debian release
VERSION=`lsb_release -sc`

wget -O - https://monitoring2/icinga.key  --no-check-certificate | apt-key add -
echo "deb https://packages.icinga.com/debian icinga-$VERSION main" > /etc/apt/sources.list.d/icinga.list

# Installing icinga2 and monitoring(nagios)-plugins
apt-get update --allow-unauthenticated
apt-get -y install icinga2-bin monitoring-plugins-basic --allow-unauthenticated

wget -O - https://monitoring2/scripts/icinga_remote_config.sh --no-check-certificate | bash

/etc/init.d/icinga2 restart
