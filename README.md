#NodeOnFHIR#

This is a local stand alone implimentation of a REST API storing data in Mongo, with tweaks to search FHIR data structures. It is based on [this](http://backbonetutorials.com/nodejs-restify-mongodb-mongoose/).

##Installation Instructions##

Note that all `cd` commands assume you are *not* already in that directory, and may be skipped if so.

###Basic Configuration###
- Install Node modules
  - `cd [NodeONFHIR install directory]`
  - `npm install`
- Enable authentication
  - Open `config.js`
    - Change `exports.authenticate=false` to `exports.authenticate=true`
    - Change `exports.authorize=false` to `exports.authorize=true`

###Import Medication Data###
NodeOnFHIR uses the NDC drug database to drive its list of medications. It is included as a submodule. Follow the following steps to download the raw data files, parse them into JSON dumps, and import them. NOTE that due to its size, the NDC database could not be included with the repo and must be downloaded manually.

- Init the submodule
  - `cd [NodeOnFHIR install directory]`
  - `git submodule init`
  - `git submodule update`
- Create a `data` directory
  - `cd [NodeOnFHIR install directory]/import/medications`
  - `mkdir data`
  - `cd data`
- Download and unzip NDC database
  - `curl -O http://www.fda.gov/downloads/Drugs/DevelopmentApprovalProcess/UCM070838.zip`
  - `unzip UCM070838.zip -d ndc`
- Run the parse script
  - `cd [NodeOnFHIR install directory]/import/medications/`
  - `python parse.py`
  - **Troubleshooting**
  	- `locale.Error: unsupported locale setting`
      - run `locale -a` to get locales supported by your system
      - edit the `locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')` line in `parse.py` to match one of the supported locales
- Start the node server by following the "Running" section below
- Import the data ([`medications`](http://www.hl7.org/implement/standards/fhir/medication.html), [`organizations`](http://www.hl7.org/implement/standards/fhir/organization.html) and [`substances`](http://www.hl7.org/implement/standards/fhir/substance.html))
  - `cd [NodeOnFHIR install directory]/import/medications`
  - `bash load.sh`
  
##Running##

- Start the server
  - `cd [NodeOnFHIR install directory]`
  - `node server`   
- Open browser and point it to `http://localhost:8080/`
