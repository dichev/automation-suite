#!/bin/bash
#

set -e

# Create log file and set permissions
mkdir -p /var/log/php
touch /var/log/php/error.log
chown -R dopamine:adm /var/log/php/

# Logrotate setup
(
cat << EOF
/var/log/php/error.log {
        rotate 7
        daily
        missingok
        notifempty
        compress
        delaycompress
        create 0660 dopamine adm
        postrotate
                service rsyslog rotate >/dev/null 2>&1 || true
        endscript
}
EOF
) > /etc/logrotate.d/phperror

# Force Logrotate
logrotate -f /etc/logrotate.d/phperror
