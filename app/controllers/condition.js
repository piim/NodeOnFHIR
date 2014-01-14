var mongoose = require('mongoose'),
	url = require('url');

var Condition = mongoose.model('Condition');

exports.search = function(req, res, next) 
{
	if ('OPTIONS' == req.method)
	{
		res.statusCode = 203;
    	res.send('OK');
	}
	
	var params = req.params;
	var query = {};
	
	if( params.name ) 
		query['name'] = new RegExp('^' + params.name, 'i');
	
	Condition.find(query).populate('vitals medications customs').exec
    (
    	function (arr, data) 
    	{
            if (data && data.length) 
            {
            	res.json( data );
            } 
            else
            {
            	res.statusCode = 404;
            	res.send('Not found');
            } 
    	}
    );
};