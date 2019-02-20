apt-get update
apt-get upgrade -y
apt-get install -y ntp dstat strace tcpdump git rsync vim htop curl psmisc
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get -y install nodejs


# deps
ssh-keyscan -H gitlab.dopamine.bg >> ~/.ssh/known_hosts
ssh-keyscan -H monitoring.d >> ~/.ssh/known_hosts

# sys metrics
mkdir -p /opt/dopamine/sys-metrics
cd /opt/dopamine/sys-metrics
git clone git@gitlab.dopamine.bg:releases/sys-metrics.git .
systemctl enable /opt/dopamine/sys-metrics/sys-metrics.service
systemctl start sys-metrics
systemctl status sys-metrics | head -n 3
