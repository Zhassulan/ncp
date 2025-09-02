#!/bin/bash -l
echo "PROD environment"
echo "logs cleanup "`date`
cd /var/log/nginx
for i in `ls *.log?* |grep -v 'zip$'` ; do echo $i;zip -m9 "${i##*/}".zip $i; done