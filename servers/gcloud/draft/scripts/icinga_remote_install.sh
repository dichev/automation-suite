#!/bin/bash
#
# Script to install icinga2 monitoring on remote server

LOG=/var/log/icinga_remote_install.log

# Don't edit below this line
exec > >(tee -a ${LOG} )
exec 2> >(tee -a ${LOG} >&2)

echo "---"
echo "Begin `date`" >>${LOG}


# Installing https transport for apt
apt-get update
apt-get -y install apt-transport-https curl lsb-release


# Icinga repository for the exact Debian release
VERSION=`lsb_release -sc`

wget -O - https://packages.icinga.com/icinga.key | apt-key add -
echo "deb https://packages.icinga.com/debian icinga-$VERSION main" > /etc/apt/sources.list.d/icinga.list

# Installing icinga2 and monitoring(nagios)-plugins
apt-get update
apt-get -y install icinga2-bin monitoring-plugins-basic
