#!/bin/bash
which node
echo -n "loading definitions...."
out=`node load definition`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo "done.
"
