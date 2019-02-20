#!/bin/bash
#
# Script to configure icinga2 monitoring on remote server

IP=$(hostname  -I | cut -f1 -d' ')

rm -rf /etc/icinga2/pki/$IP.???

curl 'https://monitoring2/icingaweb2/authentication/login' -H 'X-Icinga-WindowId: undefined' -H 'Origin: https://192.168.100.36' -H 'Accept-Encoding: gzip, deflate, br' -H 'X-Icinga-Accept: text/html' -H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: */*' -H 'Referer: https://192.168.100.36/icingaweb2/authentication/login' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: _chc=1; Icingaweb2=nfh6rvkuug5ngdidan2e0q6i02p0moc2; icingaweb2-tzo=10800-1' -H 'Connection: keep-alive' --data 'username=icinga&password=dopepa%24%24123%24&&redirect=&formUID=form_login&CSRFToken=2143578307%7C1c62350cccebd2b2aac4b24c34b3e6642e81887c007206e58316071fee6eee38&btn_submit=Login' --compressed --insecure --cookie-jar cookie.txt

curl 'https://monitoring2/icingaweb2/director/host/agent?name='$IP'&download=linux' -H 'X-Icinga-WindowId: thjvyarwluxe' -H 'Accept-Encoding: gzip, deflate, br' -H 'X-Icinga-Accept: text/html' -H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: */*' -H 'Referer: https://192.168.100.36/icingaweb2/director/hosts?page=4' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' --compressed --insecure --cookie cookie.txt | bash

/etc/init.d/icinga2 restart
