var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');

require('../../app/models/fhir');
require('../../app/models/definition');
require('../../app/models/condition');

var Condition = mongoose.model('Condition');

var parseCondition = function(i)
{
	i = i || 0;
	
	var json = list[i];
    
	var condition = new Condition();
	condition.name = json.name;
	condition.vitals = [];
	condition.medications = [];
	condition.customs = [];
	
	var lookups = [];
	
	for(var prop in json)
	{
		if( prop == 'label' ) continue;
		if( json[prop] == null ) continue;
		
		for(var value in json[prop])
    	{
			lookups.push( {type:prop,code:json[prop][value].code} );
    	}
	}
	
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
					
					if( l == lookups.length - 1)
					{
						condition.save
						(
							function(err)
							{
								if( err )
									console.log( 'error', err );
								else
									console.log( 'condition "' + condition.name + '" saved' );
								
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
			)
		})(l);		
	}
}

//	check if data file exists
if( fs.existsSync('./conditions') )
{
    require('./conditions');

    //	clear collection
    Condition.collection.drop();
    
    parseCondition();
}
else
{
    console.log("couldn't find file `./conditions`");
    
    process.exit(1);
}