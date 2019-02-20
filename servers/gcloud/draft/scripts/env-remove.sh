#!/bin/bash
set -e

# Author: dichev
#
# Example usage:
#   $ ./env-remove dev testenv
#



# Validations
ENV="$1"
NAME="$2"
if ! [[ (${ENV} = "dev" || ${ENV} = "staging") && ${NAME} =~ ^[a-z0-9_-]+$  ]] ; then
   echo -e "Invalid or missing parameters: env=${ENV} | name=${NAME}";
   echo -e "Usage:\n  $ env-remove <ENV> <NAME>";
   echo -e "Example:\n  $ env-remove dev testenv\n  $ env-remove staging testenv";
   exit 1
fi

echo "REMOVING ${ENV} environment: ${NAME}"




echo "Remove nginx configuration.."
rm -f /etc/nginx/conf.d/upstream/${NAME}-${ENV}.conf
rm -f /etc/nginx/conf.d/template/${NAME}-${ENV}.conf
rm -f /etc/nginx/sites-enabled/${NAME}-${ENV}.conf
if ! [[ -f "/etc/nginx/sites-enabled/${NAME}-dev" || -f "/etc/nginx/sites-enabled/${NAME}-staging" ]] ; then
    rm -f /etc/nginx/conf.d/allow/${NAME}.conf
    # TODO: better to have separate allow files for each env
fi
/etc/init.d/nginx reload

echo Ready!