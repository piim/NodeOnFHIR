#!/bin/bash
which node
echo "Would you like to clear the definitions/conditions collections [Y/N]?"

read clear

echo -n "Loading definitions...."
out=`node definitions/load-definitions $clear`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo -n "Loading conditions...."
out=`node conditions/load-conditions $clear`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo "done.
"
