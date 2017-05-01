#!/bin/bash

PROJECT_NAME="ps-teconomy-2017"
IMAGE_NAME="ps-tec-17"
CLUSTER_NAME="cluster-ps-tec-17"
SERVICE_NAME="demo"


gcloud auth login

echo "Setting project to $PROJECT_NAME"
gcloud config set project $PROJECT_NAME

gcloud container clusters create $CLUSTER_NAME --zone europe-west1-b --machine-type n1-standard-1 --num-nodes 2 --disk-size 25
gcloud container clusters get-credentials $CLUSTER_NAME
gcloud config set container/cluster $CLUSTER_NAME

echo "Building $PROJECT_NAME/$IMAGE_NAME"
docker build -t "eu.gcr.io/$PROJECT_NAME/$IMAGE_NAME:latest" .
gcloud docker -- push eu.gcr.io/$PROJECT_NAME/$IMAGE_NAME:latest

echo "Creating container"
kubectl run $SERVICE_NAME --image=eu.gcr.io/$PROJECT_NAME/$IMAGE_NAME:latest --port 8000

echo "Creating service $SERVICE_NAME"
kubectl expose deployment $SERVICE_NAME --type=LoadBalancer --port 80 --target-port 8000

kubectl get services
kubectl get deployments
gcloud container clusters list

echo "Starting proxy application on localhost"
kubectl proxy