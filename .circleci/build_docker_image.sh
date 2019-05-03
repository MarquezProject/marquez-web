#!/bin/sh
# This is a standard WeWork CircleCI helper used by config.yml

docker login $DOCKER_REGISTRY -u $DOCKER_USER -p$DOCKER_PASSWD &&
docker pull $DOCKER_REPOSITORY:$CIRCLE_SHA1 ||
docker build --build-arg CIRCLE_SHA1=$CIRCLE_SHA1 -t $DOCKER_REPOSITORY:$CIRCLE_SHA1 . &&
docker push $DOCKER_REPOSITORY:$CIRCLE_SHA1

if [ ! -z $CIRCLE_TAG ]; then
    docker tag $DOCKER_REPOSITORY:$CIRCLE_SHA1 $DOCKER_REPOSITORY:$CIRCLE_TAG
    docker push $DOCKER_REPOSITORY:$CIRCLE_TAG
fi