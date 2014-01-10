#!/bin/bash
which node
echo -n "loading definitions...."
out=`node definitions/load-definitions`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo -n "loading conditions...."
out=`node conditions/load-conditions`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo "done.
"
