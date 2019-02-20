#!/bin/bash
set -e

# Author: dichev
#
# Example usage:
#   $ env-create dev testenv
#
# will make it accessible at:
#   https://gserver-testenv-dev.dopamine-gaming.com/testenv/
#   https://gpanel-testenv-dev.dopamine-gaming.com/testenv/



# Validations
ENV="$1"
NAME="$2"
TEMPLATE="testenv" # TODO: must be used separate template file OR the template generator

if ! [[ (${ENV} = "dev" || ${ENV} = "staging") && ${NAME} =~ ^[a-z0-9_-]+$  ]] ; then
   echo -e "Invalid or missing parameters: env=${ENV} | name=${NAME}";
   echo -e "Usage:\n  $ env-create <ENV> <NAME>";
   echo -e "Example:\n  $ env-create dev testenv\n  $ env-create staging testenv";
   exit 1
fi


echo "Configuring new ${ENV} environment: ${NAME}"


echo "Setting nginx of the load balancer.."

cp /etc/nginx/conf.d/upstream/${TEMPLATE}-${ENV}.conf      /etc/nginx/conf.d/upstream/${NAME}-${ENV}.conf
cp /etc/nginx/conf.d/template/${TEMPLATE}-${ENV}.conf      /etc/nginx/conf.d/template/${NAME}-${ENV}.conf
cp /etc/nginx/sites-enabled/${TEMPLATE}-${ENV}.conf        /etc/nginx/sites-enabled/${NAME}-${ENV}.conf
touch /etc/nginx/conf.d/allow/${NAME}.conf

sed --in-place "s/${TEMPLATE}/${NAME}/g" /etc/nginx/conf.d/upstream/${NAME}-${ENV}.conf
sed --in-place "s/${TEMPLATE}/${NAME}/g" /etc/nginx/conf.d/template/${NAME}-${ENV}.conf
sed --in-place "s/${TEMPLATE}/${NAME}/g" /etc/nginx/sites-enabled/${NAME}-${ENV}.conf

/etc/init.d/nginx reload

echo Ready!