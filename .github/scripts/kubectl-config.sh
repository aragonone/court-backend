#!/bin/sh
KUBE_CA="$1"
KUBE_SERVER="$2"
KUBE_TOKEN="$3"
# config cluster access
echo $KUBE_CA | base64 -d > ca.crt
kubectl config set-cluster aragon --server=$KUBE_SERVER --certificate-authority=ca.crt
kubectl config set-credentials aragon --token=$(base64 -d <<< $KUBE_TOKEN)
kubectl config set-context aragon --cluster=aragon --user=aragon
kubectl config use-context aragon
