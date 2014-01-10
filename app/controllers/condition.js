var mongoose = require('mongoose'),
	url = require('url');

var Condition = mongoose.model('Condition'),
	Definition = mongoose.model('Definition');

exports.search = function(req, res, next) 
{
	if ('OPTIONS' == req.method) 
		 res.send(203, 'OK');
	
	var params = req.params;
    
	var query = {};
	
	if( params.name ) query['name'] = params.name;
	
	Condition.find(query).populate('vitals medications customs').exec
    (
    	function (arr, data) 
    	{
            if (data && data.length) 
            {
            	var entries = [];

                res.send( JSON.stringify(data) );
            } 
            else
            {
            	res.send(404, 'Not found');
            } 
    	}
    );
};