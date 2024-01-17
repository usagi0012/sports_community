#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
APP_NAME="project"
PM2_PATH="/usr/local/bin/pm2"

TIME_NOW=$(date +%c)

cd $PROJECT_ROOT
node -v
pm2 -v
npm -v

pm2 delete $APP_NAME
pm2 start npm --name $APP_NAME -- start

echo "$TIME_NOW > Deploy has been completed"