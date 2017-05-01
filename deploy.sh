#!/bin/bash

set -e

sudo /opt/google-cloud-sdk/bin/gcloud docker -- push eu.gcr.io/${PROJECT_NAME}/${IMAGE_NAME}:$CIRCLE_SHA1
sudo chown -R ubuntu:ubuntu /home/ubuntu/.kube
echo Pushed to GCR

kubectl set image deployment/demo demo=eu.gcr.io/${PROJECT_NAME}/${IMAGE_NAME}:$CIRCLE_SHA1

SERVICE_IP=`kubectl get services | grep demo | awk -F ' ' '{print $3}'`
echo "Kubernetes service IP: $SERVICE_IP"
echo "Git SHA: $CIRCLE_SHA1"

echo url="https://www.duckdns.org/update?domains=pstec&token=7b1e3eed-bc64-4edb-a370-52526ccbfba1&ip=$SERVICE_IP" | curl -k -K -