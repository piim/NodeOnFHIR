var fs = require('fs');
var httpServer = require('http');
var mongoose = require('mongoose'),Schema = mongoose.Schema;
var restify = require('restify');
var jwt = require('jwt-simple');

var config = require('./config/config');

var mongo_uri = (process.env.PORT) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;

var db = mongoose.connect(mongo_uri);

//  initialize server
var server = restify.createServer
(
	{
	    formatters: 
	    {
	        'application/json+fhir': function(req, res, body)
	        {
	            if(req.params.callback)
	            {
	                var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
	                return callbackFunctionName + "(" + JSON.stringify(body) + ");";
	            } 
	            else 
	            {
	                return JSON.stringify(body);
	            }
	        }
	    }
	}
);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.CORS());

server.use
(
	function myResponseHeaders(req, res, next) 
	{
		res.once
		(
			'header', 
			function () 
			{
				res.setHeader('Access-Control-Allow-Origin', "*");
				res.setHeader('Access-Control-Allow-Headers', 'Accept, Accept-Version, Content-Type, Api-Version, Origin, X-Requested-With, Authorization, token');
			}
		);
		next();
	}
);

server.on
(
	'MethodNotAllowed', 
	function unknownMethodHandler(req, res) 
	{
		if (req.method.toLowerCase() === 'options') 
		{
	        var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization', 'token']; // added Origin & X-Requested-With & **Authorization**
	
	        if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');
	
	        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
	        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
	        res.header('Access-Control-Allow-Origin', req.headers.origin);
	
	        res.statusCode = 200;
	        return res.send('');
		}
		else
			return res.send(new restify.MethodNotAllowedError());
	}
);

//  only authorize if authenticating
config.authorize = config.authenticate && config.authorize;

require('./app/models/fhir');
require('./app/models/user');
require('./app/models/definition');
require('./app/models/condition');
require('./config/routes')(server);

server.listen
(
	config.local_port, 
	function () 
	{
		var consoleMessage = '\n Simple Fhir server api: port ' + config.local_port;
		console.log(consoleMessage, server.name, server.url);
	}
);
