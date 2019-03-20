# PROOF OF CONCEPT, NOT READY
# by n.terziev

FROM debian:stretch

RUN     export DEBIAN_FRONTEND=noninteractive \
     && apt-get update -q \
     && apt-get install -y -q dialog apt-utils software-properties-common dirmngr \
     && apt-get install -y -q curl git bash wget lsb-release gpgv gnupg gnupg2 openssh-server openssh-client vim bsdmainutils

RUN     export DEBIAN_FRONTEND=noninteractive \
     && wget  https://repo.percona.com/apt/percona-release_latest.$(lsb_release -sc)_all.deb \
     && dpkg -i percona-release_latest.$(lsb_release -sc)_all.deb \
     && apt-get update -q \
     && apt-get install -y -q percona-server-server-5.7

#COPY    rtg.sql /root/rtg.sql
RUN     export DEBIAN_FRONTEND=noninteractive \
     && /etc/init.d/mysql start && sleep 1 \
     && mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql \
     && mysql -uroot -D mysql -e 'update user set authentication_string=PASSWORD("") where User="root";' \
     && mysql -uroot -D mysql -e 'update user set plugin="mysql_native_password" where User="root";' \
     && mysql -uroot          -e 'create database test_test;' \
     && mysql -uroot -D mysql -e 'flush privileges' \
     && echo "Importing dump" \
#    && mysql -uroot < /root/rtg.sql && sleep 1 \
     && mysql -e "SELECT CONCAT('CHECKSUM TABLE ',CONCAT_WS('.',TABLE_SCHEMA,TABLE_NAME),';') as tn FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE 'rtg_%' ORDER BY TABLE_NAME ASC" \
        | tr '|' ' ' | grep CHECKSUM | mysql | grep -v 'Checksum' | column -t > /checksum-A.log && sleep 1 \
     && echo "Stopping sql" \
     && etc/init.d/mysql stop

COPY    id_rsa /root/.ssh/id_rsa
RUN     eval $(ssh-agent -s) \
     && ssh-add /root/.ssh/id_rsa \
     && echo "Host gitlab.dopamine.bg\n\tStrictHostKeyChecking no\n" > /root/.ssh/config \
     && git config --global user.name "n.terziev" \
     && git config --global user.email "n.terziev@dopamine.bg"

# RUN      echo "Stage: Import Dope-config" \
#      && git clone git@gitlab.dopamine.bg:servers/servers-conf-mysql.git /opt/servers-conf-mysql \
#      && mv /etc/mysql /etc/mysql.old \
#      && ln -svfT /opt/servers-conf-mysql/mysql /etc/mysql && [ -d /etc/mysql ] \
#      && ln -svfT /opt/servers-conf-mysql/mysql.service /lib/systemd/system/mysql.service && [ -f /lib/systemd/system/mysql.service ] \
#      && ln -svfT /opt/servers-conf-mysql/mysql /etc/mysql && [ -d /etc/mysql ] \
#      && ln -svfT /opt/servers-conf-mysql/custom/sofia-dev-db-master1.cnf /etc/mysql/conf.d/mysqld_custom.cnf && [ -f /etc/mysql/conf.d/mysqld_custom.cnf ] \
#      && chown -R mysql:mysql /var/lib/mysql \
#      && chown -R mysql:mysql /var/run/mysqld

RUN     echo "#!/bin/bash" >> migrate.sh \
     && echo "export DEBIAN_FRONTEND=noninteractive" >> migrate.sh \
     && echo "curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | bash" >> migrate.sh \
     && echo "apt-get update -y" >> migrate.sh \
     && echo "/etc/init.d/mysql stop && sleep 1" >> migrate.sh \
     && echo "apt-get remove -y -q mysql-*" >> migrate.sh \
     && echo "apt-get install -y -q mariadb-server" >> migrate.sh \
     && echo "/etc/init.d/mysql start && sleep 1" >> migrate.sh \
     && echo "mysql -e 'show databases;'" >> migrate.sh \
     && echo "mysql --version" >> migrate.sh \
     && chmod +x migrate.sh

#mysql -e "SELECT CONCAT('CHECKSUM TABLE ',CONCAT_WS('.',TABLE_SCHEMA,TABLE_NAME),';') as tn FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE 'rtg_%' ORDER BY TABLE_NAME ASC" | tr '|' ' ' | grep CHECKSUM | mysql | grep -v 'Checksum' | column -t > /checksum-B.log
#diff /checksum-A.log /checksum-B.log