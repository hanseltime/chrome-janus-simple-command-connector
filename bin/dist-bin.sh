#!/bin/bash -e
FILE=${1/src/dist}
FILE=${FILE/.ts/.js}

if [ ! -f "${FILE}" ]; then
   echo "File does not exist in dist/ repository.  Please ensure that you have built the lastest typescript"
   exit 1
fi

NODE_PATH=`pwd`/dist node -r source-map-support/register --async-stack-traces $FILE "${@:2}"
