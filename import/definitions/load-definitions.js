var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');

var config = require('../../config/config');
var mongo_uri = (process.env.PORT) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;
var db = mongoose.connect(mongo_uri);

require('../../app/models/fhir');
require('../../app/models/definition');

var Definition = mongoose.model('Definition')

var parseDefinitions = function()
{
    for (var i = 0; i < list.length; i++)
    {
    	(function(i)
    	{
    		if (list[i] != undefined)
            {
        		var definition = new Definition( list[i] );
                    
                definition.save
                (
                	function(err)
                	{
                		if( !err )
                		{
                			if( i == list.length-1 )
                				process.exit();
                		}
                		else
                		{
                			console.log(err);
                		}
                	}
                );
            }
    	})(i);
    }
}

//	check if data file exists
if( fs.existsSync('./definitions') )
{
    require('./definitions');

    if( process.argv[2] == "Y" )
    {
    	//	clear collection
    	Definition.collection.drop();
    }
    
    parseDefinitions();
}
else
{
    console.log("couldn't find file `./definitions'");
    
    process.exit(1);
}