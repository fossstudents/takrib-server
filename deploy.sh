#!/bin/bash
docker build -t fosspakistan/takrib-server .
docker push fosspakistan/takrib-server

ssh deploy@$DEPLOY_SERVER << EOF
docker pull fosspakistan/takrib-server
docker stop takrib-api || true
docker rm takrib-api || true
docker rmi fosspakistan/takrib-server:current || true
docker tag fosspakistan/takrib-server:latest fosspakistan/takrib-server:current
docker run -d --restart always --name takrib-api -p 3000:3000 fosspakistan/takrib-server:current
EOF
