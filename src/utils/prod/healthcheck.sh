#!/bin/bash -l
echo "healthcheck "`date` > /proc/1/fd/1
#curl -f http://localhost:8080/ceir-dump-loader/actuator/health ||  bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)' > /proc/1/fd/1 2>/proc/1/fd/2