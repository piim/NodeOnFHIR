var jwt = require('jwt-simple'),
	model = require('../models/fhir'),
	config = require('../../config/config');

//Hopefully this is never used in production, but (god forbid) you can change this.... walk with god.
var root_url = 'http://localhost:' + config.local_port;

/**
 * Searches a resource (by title only)
 * 
 * @req Request object (restify)
 * @res Response object  (restify)
 * @next 
 * @model Mongoose model corresponding to the FHIR resource
 * @resourceId String representing FHIR resource
 */
exports.searchResource = function (req, res, next, model, resourceId) {

    if ('OPTIONS' == req.method) 
    {
    	res.statusCode = 203;
        res.send('OK');
    }
    
    console.log("searchResource", resourceId, req.params[0]);
    
    model.find
    (
    	{
    		"entry.title": new RegExp('^' + resourceId + '.*' + req.params[0])
    	}
    )
    .exec
    (
    	function (arr, data) 
    	{
	        if (data.length > 0) 
	        {
	            data[0].entry.published = new Date().toISOString();
	            res.json( data[0] );
	        } else 
	        {
	        	res.statusCode = 404;
	            res.send('Not found');
	        }
	    }
    );
};

/**
 * Searches a resource
 * 
 * @req Request object (Object)
 * @res Response object (Object)
 * @next 
 * @model Mongoose model corresponding to the FHIR resource (Object)
 * @resourceId String representation of FHIR resource type (String)
 * @queryDefinitions Definition of searchable fields (Object)
 *  {
 *      `id`: "name",                 //  parameter in request containing value to search for
 *      `field`: "name.family.value", //  path to property in @resourceId FHIR resource, after "entry.content.ResourceName."
 *      `search`: [..]                //  array of search type objects, if more than one will result in an "$or" expression
 *          `regex`: "^{{value}}.*"   //  regex for value matching, where {{value}} is replaced by request value if present
 *          `prefix`: "patient/@"     //  prefix for value matching, if not regex
 *  }
 *  @ownerIdPath Path within schema to property specifying resource owner (String)
 */
exports.searchResourceParams = function (req, res, next, model, resourceId, queryDefinitions, ownerIdPath) 
{
	ownerIdPath = ownerIdPath || "entry.content.{{resourceId}}.patient.reference.value";
	ownerIdPath = ownerIdPath.replace( /{{resourceId}}/, resourceId);
	
    if ('OPTIONS' == req.method) 
    {
    	res.statusCode = 203;
        res.send('OK');
    }

    console.log("searchResourceParams", resourceId, req.params[0], ownerIdPath);

    query = {};
    
    //  if authorization is enabled and resource has a patient resource reference, 
    //  add a query clause specifying that only those resources that match the access
    //  token passed in the request header
    if( config.authorize 
        && new model().schema.path(ownerIdPath) != undefined ) {
        
        if( req.headers.token )
        {
            var user = jwt.decode(req.headers.token.toString(),config.authentication_secret);
            query[ownerIdPath] = 'patient/@' + user.id;
        }
        else
        {
        	res.statusCode = 401;
            res.send("Unauthorized");
        }
    }
    
    var params = [];
    
    if( req.method == "GET" )
    {
        params = req.params;
        
        //  trim quotes from parameters
        for (key in params)
        {
            var temp = params[key];
            var firstChar = temp.charAt(0);
            var lastChar = temp.charAt(temp.length-1);

            if (firstChar==lastChar && (firstChar=="'" || firstChar=='"'))
                params[key] = temp.substring(1,temp.length-1);
        }
    }
    
    //  dynamically construct the query based on mapping the query definitions
    //  against the request
    for(var q in queryDefinitions)
    {
        var definition = queryDefinitions[q];
        
        if (params[definition.id]!=undefined) 
        {
            var queryElements = [];
            
            for(var s in definition.search)
            {
                var fieldName = definition.search[s].field ? definition.search[s].field : definition.field;
                var propName = "entry.content." + resourceId + "." + fieldName;
                
                var queryElement = {};
                
                if( definition.search[s].regex )
                {
                    queryElement[propName] = new RegExp(definition.search[s].regex.replace("{{value}}",params[definition.id]), definition.search[s].flags );
                }
                else
                {
                    queryElement[propName] = (definition.search[s].prefix?definition.search[s].prefix:"") + params[definition.id];
                }
                
                queryElements.push( queryElement );
            }
            
            if( queryElements.length > 1 )
                query['$or'] = queryElements;
            else
                for(var p in queryElements[0])
                    query[p] = queryElements[0][p];
        }
    }
    
    console.log( query );
    
    var entries = [];
    
    //  node crashes when collection length exceeds 1000, so stream
    model.find(query).stream().on
    (
    	'data', 
    	function (data) 
    	{
    		entries.push(data);
    	}
    )
	.on
	(
		'close', 
		function () 
		{
			if( res.statusCode != 401 )
				res.json( formatFhir(entries) );
		}
	);
};

/**
 * Deletes a resource
 * 
 * @req Request object (restify)
 * @res Response object (restify)
 * @next 
 * @model Mongoose model corresponding to the FHIR resource
 * @resourceId String representing FHIR resource
 * 
 * @TODO implement auth
 */
exports.deleteResource = function (req, res, next, model, resourceId) {

    if ('OPTIONS' == req.method) 
    {
    	res.statusCode = 203;
        res.send('OK');
    }

    console.log("deleteResource", resourceId, req.params);

    model.find
    (
    	{"entry.title": new RegExp('^' + resourceId + '.*' + req.params[0])}
    )
    .exec
    (
    	function (arr, data) 
    	{
	        if (data.length > 0) 
	        {
	            data[0].remove();
	            
	            res.statusCode = 204;
	            res.send('No content');
	        } 
	        else 
	        {
	        	res.statusCode = 404;
	        	res.send('Not found');
	        }
	    }
    );
};

/**
 * Gets all records for a resource
 * 
 * @req Request object (restify)
 * @res Response object (restify)
 * @next 
 * @model Mongoose model corresponding to the FHIR resource
 * @resourceId String representing FHIR resource
 * 
 * @TODO implement auth
 */
exports.getResourceHistory = function (req, res, next, model, resourceId) {

    if ('OPTIONS' == req.method) {
        res.send(203, 'OK');
    }

    console.log("getResourceHistory", resourceId);

    model.find
    (
    	{
    		"entry.title": new RegExp('^' + resourceId)
    	}
    )
    .exec
    (
    	function (arr, data) 
    	{
    		res.json( formatFhir(data) );
    	}
    );
};

/**
 * Saves a records for en masse a resource
 * 
 * @req Request object (restify)
 * @res Response object (restify)
 * @next 
 * @model Mongoose model corresponding to the FHIR resource
 * @resourceId String representing FHIR resource
 * 
 * @TODO deprecate for puts
 */
exports.postDump = function (req, res, next, model, resourceId) 
{
    if ('OPTIONS' == req.method) 
    {
    	res.statusCode = 203;
        res.send('OK');
    }
    
    console.log("postDump", resourceId, req.body);

    var entry = JSON.stringify(req.body).replace(new RegExp("{{hostname}}", 'g'), root_url);

    // Create a new message model, fill it up and save it to Mongodb
    var item = new model();
    item.entry = JSON.parse(entry);
    item.save
    (
    	function () 
    	{
    		res.json(entry); //TODO, actual response code? How about validation?
    	}
    );
};

exports.putResource = function (req, res, next, model, resourceId) 
{
	if ('OPTIONS' == req.method) 
    {
    	res.statusCode = 203;
        res.send('OK');
    }

    var resource = req.body;
    console.log( resource );
    
    if (req.params && req.params[0]) 
    {
        model.find
        (
        	{
        		"entry.title": new RegExp('^' + resourceId + '.*' + req.params[0])
        	}
        )
        .exec
        (
        	function (arr, data) 
        	{
	            if (data.length > 0) 
	            {
	                updateData(req.params[0], resource, data[0], req.connection.remoteAddress, res, model);
	            } 
	            else 
	            {
	                newData(createUUID(), resource, req.connection.remoteAddress, res, model);
	            }
	        }
        );
    } 
    else 
    {
        newData(createUUID(), resource, req.connection.remoteAddress, res, model);
    };
};

var formatFhir = function (entries) 
{
    //TODO put JSON definition of the document junk here
    var entry_array = new Array();
    var date = new Date();
    var dateString = date.toISOString();
    
    for (var i = 0; i < entries.length; i++) 
    {
        entries[i].entry.updated = dateString;
        entry_array.push(entries[i].entry);
    }
    
    var finished_doc = {
        'totalResults': entries.length,
        'link': [],
        'updated': dateString,
        'entries': entry_array
    };
    
    return finished_doc;
};

var updateData = function (uuid, data, message, remoteAddress, res, model) 
{
    var type = "";
    
    for (var key in data) {
        type = key;
    }

    var item = new model();
    item.entry = message.entry;

    model.remove
    (
    	{
    		"entry.title": new RegExp('^' + type + '.*' + uuid)
    	}, 
    	function (err) 
    	{
	        console.log(err);
	
	        item.entry.updated = new Date().toISOString();
	        item.entry.published = new Date().toISOString();
	        item.entry.content = data;
	        item.entry.author = [{
	            'name': remoteAddress
	        }];
	        item.entry.summary = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + data[type].text.div;
	        item.save
	        (
	        	function () 
	        	{
	        		res.json(data); //TODO, actual response code? How about validation?
	        	}
	        );
    	}
    );
};

var newData = function (uuid, data, remoteAddress, res, model) 
{
    var type = "";
    for (var key in data) {
        type = key;
    }

    var lowercase = type.toLowerCase();

    console.log( 'contentType=' + res.contentType );
    
    var item = new model();
    var entry = {
        'title': key + ' \"' + uuid + '\" Version \"1\"',
        'id': 'http://localhost:8888/' + lowercase + '/@' + uuid,
        'link': [{
            "href": "http://localhost:8888/" + lowercase + "/@" + uuid + "/@1",
            "rel": "self"
        }],
        'updated': new Date().toISOString(),
        'published': new Date().toISOString(),
        'author': [{
            'name': remoteAddress
        }],
        'content': data,
        'summary': "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + data[type].text.div
    };
    
    item.entry = entry;
    item.save
    (
    	function () 
    	{
    		res.json(item); //TODO, actual response code? How about validation?
    	}
    );
};

/**
 * Utility functions
 */
var createUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};