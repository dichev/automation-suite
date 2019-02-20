dpkg-reconfigure tzdata
apt-get update
apt-get updgrade -y
apt-get install curl wget -y
wget -O - http://192.168.100.29/scripts/fix-dns.sh | bash
wget -O - http://192.168.100.29/scripts/basic-tools.sh | bash
wget -O - http://192.168.100.29/scripts/make-user.sh | bash
wget -O - http://192.168.100.29/scripts/remote-syslog.sh | bash

wget https://repo.percona.com/apt/percona-release_0.1-4.$(lsb_release -sc)_all.deb
dpkg -i percona-release_0.1-4.$(lsb_release -sc)_all.deb
apt-get update
apt-get install percona-server-server-5.7 percona-toolkit percona-xtrabackup-24 percona-nagios-plugins nagios-nrpe-server -y
