#!/bin/sh

export APP_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "app version: ${APP_VERSION}"

export IIOS_NAMESPACE=ignitialio
export IIOS_SERVER_PORT=20199
export IIOS_DOCKER_EXPORTED_PORTS=$IIOS_SERVER_PORT:$IIOS_SERVER_PORT

docker-compose up -d
