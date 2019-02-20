#!/bin/bash
#
# Install and configure mysqldump-secure script
#

apt-get update --allow-unauthenticated
apt-get -y install pigz

chmod 400 ~/.my.cnf

wget -O /usr/local/bin/mysqldump-secure --no-check-certificate https://monitoring2.dopamine.bg/scripts/mysqldump-secure
chmod +x /usr/local/bin/mysqldump-secure

(
cat << EOF
DUMP_DIR="/backups/\`hostname\`"
DUMP_DIR_CHMOD="0755"
DUMP_FILE_PRE="\$(date '+%Y-%m-%d')-\$(date '+%H-%M')-"
DUMP_FILE_CHMOD="0644"
MYSQL_CNF_FILE="/root/.my.cnf"
MYSQL_SSL_ENABLE=0
MYSQL_SSL_CA_PEM="/path/to/ca.pem"
IGNORE="information_schema performance_schema"
REQUIRE="mysql"
MYSQL_OPTS="--opt --default-character-set=utf8 --events --triggers --routines --hex-blob --complete-insert --extended-insert --compress"
MYSQL_OPTS_QUICK_MIN_SIZE=200
CONSISTENT_DUMP_ONLY_INNODB=1
CONSISTENT_DUMP_NO_INNODB=1
CONSISTENT_DUMP_MIXED_INNODB=1
LOG=2
LOG_FILE="/var/log/backups/mysqldump-secure.log"
LOG_CHMOD="0600"
COMPRESS=1
COMPRESS_BIN="pigz"
COMPRESS_ARG="-9 --stdout"
COMPRESS_EXT="gz"
DELETE=0
DELETE_METHOD="tmpreaper"
DELETE_FORCE=0
DELETE_IF_OLDER=7d
NAGIOS_LOG=1
NAGIOS_LOG_FILE="/var/log/mysqldump-secure.nagios.log"
NAGIOS_LOG_CHMOD="0644"
DUMP_FILE_INFO=1
TMP_DIR="/tmp"
ENCRYPT=0
OPENSSL_ALGO_ARG="-aes256"
OPENSSL_PUBKEY_PEM="/etc/mysqldump-secure.pub.pem"

EOF
) > /etc/mysqldump-secure.conf

wget -O /usr/lib/nagios/plugins/check_mysqldump-secure --no-check-certificate https://monitoring2.dopamine.bg/scripts/check_mysqldump-secure
chmod +x /usr/lib/nagios/plugins/check_mysqldump-secure

echo "command[check_mysqldump-secure]=/usr/lib/nagios/plugins/check_mysqldump-secure -i24 -f/var/log/mysqldump-secure.nagios.log" >> /etc/nagios/nrpe.cfg

systemctl restart nagios-nrpe-server.service

echo "Don't forget to add cronjob to /etc/cron.d/mysqldump-secure.conf"
echo "example: 20 2 * * * root mysqldump-secure --cron"
