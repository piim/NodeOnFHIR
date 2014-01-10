var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');

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

    //	clear collection
    Definition.collection.drop();
    
    parseDefinitions();
}
else
{
    console.log("couldn't find file `./definitions'");
    
    process.exit(1);
}