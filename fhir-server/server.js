var fs = require('fs');
var httpServer = require('http');
var mongoose = require('mongoose'),Schema = mongoose.Schema;
var restify = require('restify');
var jwt = require('jwt-simple');

var config = require('./config/config');

var local_port = 8888;

//Hopefully this is never used in production, but (god forbid) you can change this.... walk with god.
var root_url = 'http://localhost:' + local_port;
var replace_url = "http://hl7connect.healthintersections.com.au/svc/fhir";
var mongo_uri = (process.env.PORT) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;

var db = mongoose.connect(mongo_uri);

//  initialize server
var server = restify.createServer({
    formatters: {
        'application/json': function(req, res, body){
            if(req.params.callback){
                var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
                return callbackFunctionName + "(" + JSON.stringify(body) + ");";
            } else {
                return JSON.stringify(body);
            }
        },
        'application/json+fhir': function(req, res, body){
            if(req.params.callback){
                var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
                return callbackFunctionName + "(" + JSON.stringify(body) + ");";
            } else {
                return JSON.stringify(body);
            }
        },
        'text/html': function(req, res, body){
            return body;
        }
    }
});

server.use(restify.bodyParser());

restify.defaultResponseHeaders = function(data) {
    this.header('Access-Control-Allow-Origin', "*");
    this.header('Access-Control-Allow-Headers', 'Accept, Accept-Version, Content-Type, Api-Version, Origin, X-Requested-With, Authorization, token');
};

server.on('MethodNotAllowed', function unknownMethodHandler(req, res) {
    if (req.method.toLowerCase() === 'options') {
        
        var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization', 'token']; // added Origin & X-Requested-With & **Authorization**

        if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        return res.send(200);
    }
    else
      return res.send(new restify.MethodNotAllowedError());
});

//  only authorize if authenticating
config.authorize = config.authenticate && config.authorize;

require('./app/models/fhir');
require('./app/models/user');
require('./config/routes')(server);

server.listen(local_port, function () {
	var consoleMessage = '\n Simple Fhir server api: port ' + local_port;
    console.log(consoleMessage, server.name, server.url);
});
