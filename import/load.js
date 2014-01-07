var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var config = require('../config/config');

require('../app/models/definition');

Definition = mongoose.model('Definition');

var mongo_uri = (process.env.PORT) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;
var db = mongoose.connect(mongo_uri);

//	check if data file exists
if( fs.existsSync('./' + process.argv[2]) )
{
    require('./' + process.argv[2]);

    for (i = 0; i < list.length; i++)
    {
        if (list[i] != undefined)
        {
        	var definition = new Definition( list[i] );
            
            definition.save
            (
            	function(err)
            	{
            		if( err )
            			console.log(err)
            	}
            );
        }
    }
}
else
{
    console.log("couldn't find file `" + ('./' + process.argv[2]) + "'");
}