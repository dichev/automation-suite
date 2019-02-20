dpkg-reconfigure tzdata
apt-get update
apt-get updgrade -y
apt-get install curl wget -y
wget -O - http://192.168.100.29/scripts/fix-dns.sh | bash
wget -O - http://192.168.100.29/scripts/basic-tools.sh | bash
wget -O - http://192.168.100.29/scripts/make-user.sh | bash
wget -O - http://192.168.100.29/scripts/remote-syslog.sh | bash

cd /tmp 
wget -O nginx_signing.key http://nginx.org/keys/nginx_signing.key
apt-key add nginx_signing.key

echo "deb http://nginx.org/packages/debian/ stretch nginx" > /etc/apt/sources.list.d/nginx.list
echo "deb-src http://nginx.org/packages/debian/ stretch nginx" >>/etc/apt/sources.list.d/nginx.list
apt-get update
apt-get install nginx -y
