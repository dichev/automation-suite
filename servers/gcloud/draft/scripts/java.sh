#!/bin/bash
#

# install IP list
IIP="192.168.110.29
192.168.100.29"

for ipaddr in $IIP; do
  ping -c 1 -w 3 $ipaddr > /dev/null
    if [[ $? -eq 0 ]]; then
      echo "Setting to $ipaddr"
      break
    else
      echo "No ping to $ipaddr"
  fi
done

#ssh-keyscan -H $ipaddr >> ~/.ssh/known_hosts

#apt-get update
#apt-get install rsync -y
#apt-get install curl wget -y
#wget -O - http://192.168.110.29/scripts/fix-dns.sh | bash
#wget -O - http://192.168.110.29/scripts/basic-tools.sh | bash
#wget -O - http://192.168.110.29/scripts/make-user.sh | bash
#wget -O - http://192.168.110.29/scripts/remote-syslog.sh | bash

rsync -av $ipaddr:/var/www/html/bin/oracle-java8-jdk_8u181_amd64.deb /root/
dpkg -i oracle-java8-jdk_8u181_amd64.deb
apt-get install -f -y
apt-get install tomcat8 -y
rsync -av $ipaddr:/var/www/html/bin/java.security /usr/lib/jvm/oracle-java8-jdk-amd64/jre/lib/security/java.security
rsync -av $ipaddr:/var/www/html/bin/tomcat8 /etc/default/tomcat8
/etc/init.d/tomcat8 restart
