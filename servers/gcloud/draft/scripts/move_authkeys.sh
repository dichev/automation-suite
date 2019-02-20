#!/bin/bash
#
# Move the authorized keys to /etc/ssh/authorized_keys/

LOG=/var/log/move_authkeys.log

exec > >(tee -a ${LOG} )
exec 2> >(tee -a ${LOG} >&2)

echo "---"
echo "Begin `date`" >>${LOG}

echo "Creating /etc/ssh/authorized_keys"
mkdir -p /etc/ssh/authorized_keys
chmod 755 /etc/ssh/authorized_keys

echo "Moving root authorized_keys"
cp /root/.ssh/authorized_keys /etc/ssh/authorized_keys/root
if [[ $? -ne 0 ]] ; then
    echo "Unable to find root's authorized keys. Aborting!"
    exit 1
fi

echo "Creating backup of /etc/ssh/sshd_config in /etc/ssh/sshd_config.back"
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.back

echo "Updating /etc/ssh/sshd_config"
grep -v AuthorizedKeysFile /etc/ssh/sshd_config > temp && mv temp /etc/ssh/sshd_config
echo "AuthorizedKeysFile /etc/ssh/authorized_keys/%u" >> /etc/ssh/sshd_config

for homedir in `find /home/ -name authorized_keys`;
  do
    user=$(echo $homedir | awk -F '/' '{print $3;}')
    echo "Moving $user authorized_keys"
    cp $homedir /etc/ssh/authorized_keys/$user
  done

echo "Setting permissions"
chmod 644 /etc/ssh/authorized_keys/*
chown root:root /etc/ssh/authorized_keys/*

echo "Restarting service"
systemctl restart sshd.service

echo "Done"
