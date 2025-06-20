#!/bin/bash
#

# gitlab.dopamine.bg IP list
GITIP="192.168.110.13
192.168.100.13"

# monitoring.d IP list
MONIP="192.168.110.14
192.168.100.14"

# monitoring2 IP list
MON2="192.168.110.36
192.168.100.36"

for ipaddr in $GITIP; do
  ping -c 1 -w 3 $ipaddr > /dev/null
    if [[ $? -eq 0 ]]; then
      echo "Setting gitlab.dopamine.bg to $ipaddr"
      GITLINE="$ipaddr gitlab.dopamine.bg"
      break
    else
      echo "No ping to $ipaddr"
  fi
done

for ipaddr in $MONIP; do
  ping -c 1 -w 3 $ipaddr > /dev/null
    if [[ $? -eq 0 ]]; then
      echo "Setting monitoring.d to $ipaddr"
      MONLINE="$ipaddr monitoring.d"
      break
    else
      echo "No ping to $ipaddr"
  fi
done

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
cat /etc/hosts.back | grep -v gitlab.in | grep -v monitoring.d | grep -v gitlab.dopamine.bg | grep -v monitoring2 > /etc/hosts
echo "Updating /etc/hosts"
echo $GITLINE >> /etc/hosts
echo $MONLINE >> /etc/hosts
echo $MON2LINE >> /etc/hosts
