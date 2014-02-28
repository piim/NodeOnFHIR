#!/bin/bash
which node

echo "Would you like to empty the 'medications' collection? [Y/N]"
read clear

echo -n "loading medications...."
out=`node load medications/medication medication $clear`

if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo "Would you like to empty the 'substances' collection? [Y/N]"
read clear

echo -n "loading substances...."
out=`node load medications/substance substance $clear`

if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo "Would you like to empty the 'organization' collection? [Y/N]"
read clear

echo -n "loading organizations...."
out=`node load medications/organization organization $clear`

if [ $? -ne 0 ] ; then
    echo "failed."
    exit 127
else
    echo "ok."
fi

echo "The 'definition' collection will be emptied to prevent duplicates. Conntinue? [Y/N]"
read clear

echo -n "loading definitions..."
out=`node definitions/load-definitions Y`

if [ $? -ne 0 ] ; then
  echo "failed"
  echo 127
else
  echo "ok"
fi

echo -n "loading conditions..."
out=`node conditions/load-conditions Y`

if [ $? -ne 0 ] ; then
  echo "failed"
  echo 127
else
  echo "ok"
fi

echo "done"
