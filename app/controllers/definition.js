var mongoose = require('mongoose'),
	url = require('url');

var Definition = mongoose.model('Definition');

exports.search = function(req, res, next) 
{
	if ('OPTIONS' == req.method) 
		 res.send(203, 'OK');
	
	var params = url.parse(req.url,true).query;
    
	var query = {type:params.type};

	Definition.find(query).execFind
    (
    	function (arr, data) 
    	{
            if (data && data.length) 
            {
            	var entries = [];
            	
            	for(var d in data)
            		entries.push( new Definition(data[d]).toJSON({virtuals: true}) );
            	
            	console.log( entries );
            	
                res.send( entries );
            } 
            else
            {
            	res.send(404, 'Not found');
            } 
    	}
    );
};