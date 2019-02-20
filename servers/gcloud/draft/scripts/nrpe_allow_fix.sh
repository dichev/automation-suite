#!/bin/bash
#

ALLOW=allowed_hosts=192.168.100.19,192.168.110.19,127.0.0.1,192.168.100.36,192.168.110.36

CPATH=$(cat /etc/init.d/nagios-nrpe-server | grep CONFIG= | cut -f2 -d=) || { echo "Can't find nrpe config."; exit 1; }
mv $CPATH $CPATH.back
grep -i -v allowed_hosts= $CPATH.back > $CPATH
echo $ALLOW >> $CPATH

/etc/init.d/nagios-nrpe-server restart
