#!/bin/bash
#*************************************************************************
#  Enables your yarn config to point its registry to the local verdaccio
#  that you can stand up for your local development of a library.
#
#  Note: per verdaccio, this does use npm for setting some config
#*************************************************************************
use=true

if [ "$1" == "yes" ]; then
    use=true
elif [ "$1" == "no" ]; then
    use=false
else 
  echo "Did not provide either yes or no"
  exit 1
fi


if [ "${use}" == "true" ]; then
  localNpm=$(yarn npmrc local)
  if [ "$?" != "0" ]; then
     init=$(yarn npmrc)
     echo "creating a local npmrc for you"
     yarn npmrc -c local
     yarn npmrc local
  fi

  npm config set always-auth true
  npm config set registry http://localhost:4873/

  # Ensure the registry is running
  val=`curl -XGet http://localhost:4873/`
  if [ "$?" != "0" ]; then
    echo ""
    echo "Could not reach http://localhost:4873/"
    echo " Please ensure that you are running development-verdaccio"
    echo "  and have followed all instructions in the repo"
    exit 1
  fi
else
  yarn npmrc
  yarn npmrc default
fi