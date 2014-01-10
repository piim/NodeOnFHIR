var mongoose = require('mongoose');

var Definition = mongoose.model('Definition');

exports.search = function(req, res, next) 
{
	if ('OPTIONS' == req.method) 
		 res.send(203, 'OK');
	
	var params = req.params;
    
	var query = {};

	if( params.type ) query['type'] = params.type;
	if( params.label ) query['label'] = params.label;
	
	Definition.find(query).exec
    (
    	function (arr, data) 
    	{
            if (data && data.length) 
            {
            	var entries = [];
            	
            	for(var d in data)
            		entries.push( new Definition(data[d]).toJSON({virtuals: true}) );
            	
                res.send( entries );
            } 
            else
            {
            	res.send(404, 'Not found');
            } 
    	}
    );
};