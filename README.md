#NodeOnFHIR#

This is a Node server with tweaks to read and write FHIR data structures. It is based on [this](https://github.com/medcafe/NodeOnFHIR) fork, which is based on [this](http://backbonetutorials.com/nodejs-restify-mongodb-mongoose/).

##Installation##

Note that all `cd` commands assume you are *not* already in that directory, and may be skipped if so.

###Basic Configuration###

1. Install server dependencies:

        $ cd [HEPCAT install directory]/server
        $ npm install
  
2. Verify authentication/authorization is enabled:

        $ vi config/config.js
  - Change `exports.authenticate=false` to `exports.authenticate=true` if not already set
  - Change `exports.authorize=false` to `exports.authorize=true` if not already set

3. Start the server by following the **Running > Start the Node Server** section below

###Import Data###
NodeOnFHIR uses the NDC drug database to drive its list of medications. It is included as a submodule. Follow the following steps to download the raw data files, parse them into JSON dumps, and import them. NOTE that due to its size, the NDC database could not be included with the repo and must be downloaded manually.

Import Data###
HEPCAT uses the NDC drug database to drive its list of medications. It is included as a submodule of the Node server (a submodule itself). 

Execute the following steps to download the raw data files, parse them into JSON dumps, and import them into the FHIR database.

1. Create `data` directory:

        $ cd [HEPCAT install directory]/server/import/medications
        $ mkdir data
        $ cd data
  
2. Download and unzip NDC database:

        $ curl -O http://www.fda.gov/downloads/Drugs/DevelopmentApprovalProcess/UCM070838.zip
        $ unzip UCM070838.zip -d ndc
  
3. Run the parse script:

        $ cd [HEPCAT install directory]/server/import/medications/
        $ python parse.py
        
  - Troubleshooting
  	- `locale.Error: unsupported locale setting`
      - run `locale -a` to get locales supported by your system
      - edit the `locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')` line in `parse.py` to match one of the supported locales
      
4. Start the node server (if not already running) by following the **Running** section below

5. Import the data ([`medications`](http://www.hl7.org/implement/standards/fhir/medication.html), [`organizations`](http://www.hl7.org/implement/standards/fhir/organization.html) and [`substances`](http://www.hl7.org/implement/standards/fhir/substance.html))

		$ cd [HEPCAT install directory]/server/import
		$ bash load.sh
  
##Running##

Start the server:

	$ cd [NodeOnFHIR install directory]
	$ node server

Verify that the data was imported correctly by executing the following GET request:

- [Show medications matching 'advil'](http://localhost:8888/medication/search?name=advil)