#!/bin/sh
KUBE_CA="$1"
KUBE_SERVER="$2"
KUBE_TOKEN="$3"
# config cluster access
echo $KUBE_CA | base64 -d > ca.crt
kubectl config set-cluster celeste --server=$KUBE_SERVER --certificate-authority=ca.crt
kubectl config set-credentials celeste --token=$(echo $KUBE_TOKEN | base64 -d)
kubectl config set-context celeste --cluster=celeste --user=celeste
kubectl config use-context celeste
