#!/bin/bash
MASTERID=`mysql -e "SHOW SLAVE STATUS\G" | grep Master_Server_Id | awk -F ": " {'print $2'}`
logger  `echo -n "dope-slave-seconds-behind-master: " && pt-heartbeat --check -D test --master-server-id $MASTERID`
