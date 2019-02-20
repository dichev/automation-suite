dpkg-reconfigure tzdata
apt-get update
apt-get updgrade -y
apt-get install curl wget -y
wget -O - http://192.168.100.29/scripts/fix-dns.sh | bash
wget -O - http://192.168.100.29/scripts/basic-tools.sh | bash
wget -O - http://192.168.100.29/scripts/make-user.sh | bash
wget -O - http://192.168.100.29/scripts/remote-syslog.sh | bash

#apt-get -qq update && apt-get -qq install libxslt1.1 libreadline7 -y
#ssh -o StrictHostKeyChecking=no 192.168.100.19 uptime
#mkdir -p /opt/phpbrew; rsync -av --delete 192.168.100.19:/opt/phpbrew/php /opt/phpbrew/
#cd /opt/servers-conf && git pull
#rm -fv /opt/phpbrew/php/php && ln -s /opt/phpbrew/php/php-7.1.20 /opt/phpbrew/php/php
#rm -fv /opt/phpbrew/php/php/etc/php.ini && ln -s /opt/servers-conf/php/php.ini /opt/phpbrew/php/php/etc/php.ini
#rm -fv /usr/bin/php && ln -s /opt/phpbrew/php/php/bin/php /usr/bin/php
#rm -fv /etc/init.d/php*-fpm && ln -s /opt/servers-conf/php/php-fpm.init.d /etc/init.d/php-fpm
#rm -fv /etc/systemd/system/php*-fpm.service && systemctl enable /opt/servers-conf/php/php-fpm.service
#sleep 2; killall -9 php-fpm || killall -9 php5-fpm || true
#systemctl restart php-fpm && sleep 1

