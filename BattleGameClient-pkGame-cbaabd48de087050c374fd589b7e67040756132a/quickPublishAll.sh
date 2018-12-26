#!/bin/sh

version=$1

if [ -z $version ]
then version='v1'
fi

# sh quickBuildAll.sh &&

echo '--------- Publish ---------'

for i in games/*
    do 
    gameName=`echo $i | sed 's/.*games\///g'`'_'$version
    egret publish --version $gameName
    done
echo '--------- Publish Done ---------'
