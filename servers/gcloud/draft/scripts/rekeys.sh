wget http://192.168.100.29/scripts/root.key -O /tmp/root_authorized_keys
cat /tmp/root_authorized_keys > /root/.ssh/authorized_keys
wget http://192.168.100.29/scripts/users.key -O /tmp/users_authorized_keys
cat /tmp/users_authorized_keys > /home/dopamine/.ssh/authorized_keys

