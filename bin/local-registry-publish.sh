#!/bin/bash

# Get the registry address
registryEntry=$(npm config list | grep "registry" | sed "s/registry[[:space:]]*=[[:space:]]*\"\(.*\)\"/\1/")

if [[  ! "$registryEntry" =~ http://localhost:4873/.* ]]; then
  echo "You do not have an entry in your configuration for the expected local development registry"
  echo "  Please ensure that you are running janus-local-dev-registry"
  echo "  and have followed all instructions in the repo"
  exit 1
fi

# Ensure the registry is running
val=`curl -XGet http://localhost:4873/`
if [ "$?" != "0" ]; then
  echo ""
  echo "Could not reach http://localhost:4873/"
  echo " Please ensure that you are running janus-local-dev-registry"
  echo "  and have followed all instructions in the repo"
  exit 1
fi

yarn publish --registry "http://localhost:4873/"
