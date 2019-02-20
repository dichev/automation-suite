#!/bin/bash
#
# alter_charset.sh: used to convert the databases/tables charset on a server to a specific one. the output (alterfile) is a sql file with all the commands so it can be checked before execution.
#
# set the charset and collate variables
# example:
# charset=utf8
# collate=utf8_general_ci

charset=utf8
collate=utf8_general_ci

# set this to 1 if you want to alter the tables too
# converttables=0

alterfile='altercharset.sql'

echo '' > $alterfile

for database in $(mysql -s --skip-column-names -e "select schema_name from information_schema.schemata where default_collation_name != '$collate' and schema_name != 'mysql' and schema_name != 'information_schema' and schema_name != 'performance_schema' and schema_name != 'lost+found'";)
do
        echo '' >> $alterfile
        echo 'ALTER DATABASE '$database' CHARACTER SET '$charset' COLLATE '$collate';' >> $alterfile

#        if [ $converttables -eq 1 ]
#        then
#                for table in $(mysql $database -s --skip-column-names -e "show tables")
#                do
##                       echo 'ALTER TABLE '$table' CHARACTER SET '$charset' COLLATE '$collate';' >> $alterfile
#                        echo 'ALTER TABLE '$table' CONVERT TO CHARACTER SET '$charset' COLLATE '$collate';' >> $alterfile
#
#                done
#        fi
done
