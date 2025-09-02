#!/bin/bash -l
echo "cron started at "`date` > /proc/1/fd/1
service cron start
appmode=prod
echo "Application started profile:" $appmode" at "`date` > /proc/1/fd/1
nginx -g 'daemon off;' > /proc/1/fd/1