var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');

var config = require('../config/config');
var mongo_uri = (process.env.PORT) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;
var db = mongoose.connect(mongo_uri);

//	check if data file exists
if( fs.existsSync('./' + process.argv[2]) )
{
    require('./' + process.argv[2]);
    require('../app/models/fhir');
    
    if (!list.entry)
    {
        process.exit(1);
    }
    
    if( process.argv[4].toUpperCase() == "Y" )
    {
    	var Definition = mongoose.model( process.argv[3].charAt(0).toUpperCase() + process.argv[3].substr(1).toLowerCase() );
    	
    	if( Definition )
    		Definition.collection.drop();
    }
    
    var requests = list.entry.length - 1;
    
    for (var i = 0; i < list.entry.length; i++)
    {
        if (list.entry[i] != undefined)
        {
            json_string = JSON.stringify(list.entry[i]);
            
            console.log("************* entry " + i + " ***************");
            console.log(JSON.stringify(json_string));

            var headers = {
                'Content-Type' : 'application/json',
                'Content-Length' : json_string.length
            };

            var options = {
                host : 'localhost',
                port : 8888,
                path : '/' + process.argv[3] + "Dump",
                method : 'POST',
                headers : headers
            };

            // Setup the request. The options parameter is
            // the object we defined above.
            var req = http.request(options, function(res)
            {
                res.setEncoding('utf-8');

                var responseString = '';

                res.on('data', function(data)
                {
                    responseString += data;
                });

                res.on('end', function()
                {
                    console.log("server response: " + responseString);
                    
                    requests -= 1;
                    
                    if( requests == 0 )
                    {
                    	process.exit();
                    }
                });
            });

            req.on('error', function(e)
            {
                console.log("Error");
            });

            req.write(json_string);
            req.end();
        }
    }
}
else
{
    console.log("couldn't find file `" + ('./' + process.argv[2]) + "'");
}