var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');

var config = require('../../config/config');
var mongo_uri = (process.env.PORT) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;
var db = mongoose.connect(mongo_uri);

require('../../app/models/fhir');
require('../../app/models/definition');
require('../../app/models/condition');

var ConditionDefinition = mongoose.model('ConditionDefinition');

var parseCondition = function(i)
{
	i = i || 0;
	
	var json = list[i];
    
	var condition = new ConditionDefinition();
	condition.name = json.name;
	condition.code = json.code;
	condition.codeURI = json.codeURI;
	condition.codeName = json.codeName;
	condition.vitals = [];
	condition.medications = [];
	condition.customs = [];
	
	var lookups = [];
	
	for(var prop in json)
	{
		if( prop == 'name' || prop == 'code' || prop == 'codeName' || prop == 'codeURI' ) continue;
		if( json[prop] == null ) continue;
		
		for(var value in json[prop])
    	{
			lookups.push( {type:prop,code:json[prop][value].code} );
    	}
	}
	
	var queue = lookups.length;
	
	for(var l = 0;l<lookups.length;l++)
	{
		(function(l)
		{
			var lookup = lookups[l];
			
			var lookupModel = mongoose.model('Definition');
			var query = {code:lookup.code};
			
			if( lookup.type == 'medications' )
			{
				lookupModel = mongoose.model('Medication');
				query = {'entry.content.Medication.code.coding.code.value':lookup.code};
			}
			
			lookupModel.findOne(query).exec
			(
				function(err,data)
				{
					if( data )
					{
						condition[lookup.type].push( data );
					}
					
					queue--;
					
					if( queue == 0 )
					{
						condition.save
						(
							function(err)
							{
								if( err )
									console.log( 'error', err );
								else
									console.log( 'condition "' + condition.name + '" saved',condition );
								
								if( i == list.length - 1 )
									process.exit();
								else
								{
									i++;
									parseCondition(i);
								}
							}
						);
					}	
				}
			);
		})(l);		
	}
};

//	check if data file exists
if( fs.existsSync('./conditions') )
{
    require('./conditions');

    if( process.argv[2] == "Y" )
    {
    	//	clear collection
    	ConditionDefinition.collection.drop();
    }
    
    parseCondition();
}
else
{
    console.log("couldn't find file `./conditions`");
    
    process.exit(1);
}