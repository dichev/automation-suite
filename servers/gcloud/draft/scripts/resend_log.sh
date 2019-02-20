#!/bin/bash

usage="$(basename "$0") [--parameter] [file] -- script to import old logs in rsyslog/elastic

where:
    parameter is one of apacheother, apacheaccess, apacheerror, mysqlerror, nginxerror, nginxfull
    file is filename"
    
if [[ -z $1 ]]; then
    echo "$usage"
    exit 0
fi

case $1 in
        -1 | --apacheother )    filename=/var/log/apache2/other_vhosts_access.log
                                ;;
        -2 | --apacheaccess )   filename=/var/log/apache2/access.log
                                ;;
        -3 | --apacheerror )    filename=/var/log/apache2/error.log
                                ;;
        -4 | --mysqlerror )     filename=/var/log/mysql/error.log
                                ;;
        -5 | --nginxerror )     filename=/var/log/nginx/error.log
                                ;;
        -6 | --nginxfull )      filename=/var/log/nginx/full.access.log
                                ;;
esac

if [[ $2 == *.gz ]]; then
    zcat "$2" >> "$filename"
else
    cat "$2" >> "$filename"
fi
