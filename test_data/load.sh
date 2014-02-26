#!/bin/bash
which node

echo -n "loading medications...."
out=`node load medication medication`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo -n "loading substances...."
out=`node load substance substance`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo -n "loading organizations...."
out=`node load organization organization`
if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo "done.
"
