#!/bin/sh
export POSTMARK_SERVER_API_TOKEN="$1"
cd emails
yarn install
yarn sync:assets
yarn sync:templates
