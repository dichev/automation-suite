#!/bin/bash
#
# Script for deploying the centralized log server configuration to remote servers.

set -e

# Set the list of IPs where the centralized server may be accessed
SERVERIPLIST="192.168.100.34 192.168.110.34"

# The name of the config file that will be written
OUTFILE=/etc/rsyslog.d/dope.conf

# Once executed the script will log output to this log file
LOG=/var/log/update_rsyslog_conf.log

exec > >(tee -a ${LOG} )
exec 2> >(tee -a ${LOG} >&2)

echo "---"
echo "Begin `date`" >>${LOG}

RSYSLOG_VERSION=`rsyslogd -v | grep rsyslogd | awk '{print $2}' | cut -d\, -f1`
echo "Rsyslogd version ${RSYSLOG_VERSION}"

`dpkg --compare-versions "$RSYSLOG_VERSION" "lt" "8.4.2"` && (echo "${RSYSLOG_VERSION} is unexpected [ < 8.4.2 ]. Abort!" && exit 1)
`dpkg --compare-versions "$RSYSLOG_VERSION" "gt" "8.24.0"` && (echo "${RSYSLOG_VERSION} is unexpected [ > 8.24.0 ]. Abort!" && exit 1)

FRESH_START_TAIL='freshStartTail'
STARTMSG_REGEX='startmsg.regex'
`dpkg --compare-versions "$RSYSLOG_VERSION" "lt" "8.18.0"` && FRESH_START_TAIL="# ${FRESH_START_TAIL}" # not supported < 8.18.0
`dpkg --compare-versions "$RSYSLOG_VERSION" "lt" "8.10.0"` && STARTMSG_REGEX="# ${STARTMSG_REGEX}" # not supported < 8.10.0

# nc installation
if [ "netcat" == $(dpkg-query -W netcat | cut -f1) ]; then
  echo "netcat already installed."
else
  echo "installing netcat..."
  apt-get update
  apt-get -y install netcat
fi

# check for the correct logserver ip
for SERVERIP in $SERVERIPLIST;
  do
     echo "Trying to access $SERVERIP on port 514"
     nc -z -w5 $SERVERIP 514 && NCEXIT=0 || NCEXIT=1
     if [ $NCEXIT -eq 0 ]; then
     echo "Success!"
     echo "Using $SERVERIP"


###
# Old config backup
###
[[ -f '/etc/rsyslog.d/dope.conf' ]] && mv /etc/rsyslog.d/dope.conf "/etc/rsyslog.d/dope.backup-`date +%Y%m%d%H%M%S`"

###
# Config file generation.
###
(
cat << EOF
module(load="imfile" PollingInterval="5") #needs to be done just once

EOF
) > $OUTFILE


# mysql error.log
if [ -f /var/log/mysql/error.log ]; then
   echo "mysql log found. Setting up..."

(
cat << EOF
# mysql log
input(type="imfile"
      File="/var/log/mysql/error.log"
      Tag="mysqlerror:"
      Severity="error"
      $FRESH_START_TAIL="on"
      StateFile="mysqlerror_state"
      $STARTMSG_REGEX="^[[:digit:]]{4}-[[:digit:]]{1,2}-[[:digit:]]{1,2}"
)

EOF
) >> $OUTFILE

else
   echo "Can't find mysql logs."
fi

# nginx error.log
if [ -f /var/log/nginx/error.log ]; then
   echo "nginx error log found. Setting up..."

(
cat << EOF
# nginx error log
input(type="imfile"
      File="/var/log/nginx/error.log"
      Tag="weberror:"
      Severity="error"
      $FRESH_START_TAIL="on"
      StateFile="nginxerror_state"
      $STARTMSG_REGEX="^[[:digit:]]{4}"
)

EOF
) >> $OUTFILE

else
   echo "Can't find nginx error logs."
fi

# nginx full.access.log
if [ -f /var/log/nginx/access.log ]; then
   echo "nginx full access log found. Setting up..."

(
cat << EOF
# nginx full access log
input(type="imfile"
      File="/var/log/nginx/access.log"
      Tag="webaccess:"
      $FRESH_START_TAIL="on"
      StateFile="nginxaccess_state"
      Severity="info"
)

EOF
) >> $OUTFILE

else
   echo "Can't find nginx full access logs."
fi

# php error.log
if [ -f /var/log/php/error.log ]; then
   echo "php error log found. Setting up..."

(
cat << EOF
# php error log
input(type="imfile"
      File="/var/log/php/error.log"
      Tag="phperror:"
      Severity="error"
      $FRESH_START_TAIL="on"
      StateFile="phperror_state"
      $STARTMSG_REGEX="^\\\[")

EOF
) >> $OUTFILE

else
   echo "Can't find php error logs."
fi

# ptkill.log
if [ -f /var/log/ptkill.log ]; then
   echo "ptkill log found. Setting up..."

(
cat << EOF
# ptkill log
input(type="imfile"
      File="/var/log/ptkill.log"
      Tag="ptkill:"
      $FRESH_START_TAIL="on"
      StateFile="ptkill_state"
      Severity="info")

EOF
) >> $OUTFILE

else
   echo "Can't find ptkill logs."
fi

###
# Final part of the config.
###

(
cat << EOF

if \$syslogtag == 'mysqlerror:' then {
       *.*  @@(o,z9)$SERVERIP:514
       stop
}

if \$syslogtag == 'weberror:' then {
       *.*  @@(o,z9)$SERVERIP:514
       stop
}

if \$syslogtag == 'webaccess:' then {
       *.*  @@(o,z9)$SERVERIP:514
       stop
}

if \$syslogtag == 'phperror:' then {
       *.*  @@(o,z9)$SERVERIP:514
       stop
}

if \$syslogtag == 'ptkill:' then {
       *.*  @@(o,z9)$SERVERIP:514
       stop
}

*.* @@(o,z9)$SERVERIP:514
EOF
) >> $OUTFILE

###
# The config file ends here
###

break
  else
    echo "Can't access $SERVERIP on port 514"
  fi
done

# remove remote.conf created by another version of the script
if [ -f /etc/rsyslog.d/remote.conf ]; then
  rm -rf /etc/rsyslog.d/remote.conf
fi

# rsyslogd config validation
rsyslogd -N1 >/tmp/deprecated-rsyslog-error.log 2>&1 \
        && rm -f /tmp/deprecated-rsyslog-error.log \
        || ([[ `grep -c "parameter 'statefile' deprecated but accepted" /tmp/deprecated-rsyslog-error.log` -eq `grep -c 'error during parsing' /tmp/deprecated-rsyslog-error.log` ]] \
                && echo 'Expected error occured, continue...' \
                || (echo 'Unknown error occured. Rsyslog was not restarted!. EXIT 1' && exit 1)\
        )
systemctl restart rsyslog.service
/etc/init.d/rsyslog restart
