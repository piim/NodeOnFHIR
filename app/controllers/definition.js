var mongoose = require('mongoose');

var Definition = mongoose.model('Definition');

exports.search = function(req, res, next) 
{
	if ('OPTIONS' == req.method)
	{
		res.statusCode = 203;
    	res.send('OK');
	}
	
	var params = req.params;
    
	var query = {};

	if( params.code ) query['code'] = params.code;
	if( params.type ) query['type'] = params.type;
	if( params.label ) query['label'] = new RegExp('^' + params.label, 'i');
	
	Definition.find(query).exec
    (
    	function (arr, data) 
    	{
            if (data && data.length) 
            {
            	var entries = [];
            	
            	for(var d in data)
            		entries.push( new Definition(data[d]).toJSON({virtuals: true}) );
            	
                res.json( entries );
            } 
            else
            {
            	res.statusCode = 404;
            	res.send('Not found');
            } 
    	}
    );
};