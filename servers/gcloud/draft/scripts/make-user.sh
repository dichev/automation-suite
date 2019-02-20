wget http://192.168.100.29/scripts/root.key -O /tmp/root_authorized_keys
cat /tmp/root_authorized_keys > /root/.ssh/authorized_keys
groupadd -g 1111 dopamine
useradd -g 1111 -u 1111 -s /bin/bash -m -d /home/dopamine dopamine
gpasswd -a dopamine adm
cp /root/.ssh /home/dopamine/ -av
chown dopamine.dopamine -Rv /home/dopamine/
chmod 700 /home/dopamine/.ssh/
chmod 600 /home/dopamine/.ssh/*
wget http://192.168.100.29/scripts/users.key -O /tmp/users_authorized_keys
cat /tmp/users_authorized_keys > /home/dopamine/.ssh/authorized_keys
