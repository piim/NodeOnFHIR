var mongoose = require('mongoose'),
	crypto = require('crypto'),
	jwt = require('jwt-simple'),
	url = require('url'),
	config = require('../../config/config');

var User = mongoose.model('User'),Session = mongoose.model('Session');

var sessionLength = config.session_length != undefined ? config.session_length : 60 * 5;

if( config.authenticate ) 
{
    exports.postAuthenticate = function (req, res, next) 
    {
        if ('OPTIONS' == req.method)
        {
        	res.statusCode = 203;
        	res.send('OK');
        }
        
        var username = req.body.username;
        var password = req.body.password;
        query = { "username": username, "password": encrypt(password) };
        
        User.findOne(query).exec
        (
        	function (arr, data) 
        	{
	            if ( data ) 
	            {
	                var user = data;
	                var response = {user:user.toObject()};
	                var token = jwt.encode({id: user._id}, config.authentication_secret);
	                
	                response.id = user._id;
	                response.token = token;
	                
	                var session = setSession(user,token);
	                res.send(response);
	                
	                //	update last login
	                user.lastLogin = new Date();
	                user.save();
	            } 
	            else
	            {
	            	res.statusCode = 404;
	            	res.send('Not found');
	            }
        });
    };
    
    exports.logOut = function(req, res, next) 
    {
    	if ('OPTIONS' == req.method) 
    	{
    		res.statusCode = 203;
    		res.send('OK');
    	}
    	console.log("REQ ", req.body);
    	var token = req.header('token');
        
    	var query = {token:token};
    	
    	console.log("TOKEN ", token, "REQ ", req.body);
    	
    	Session.findOne(query).exec
        (
        	function (arr, data) 
        	{
                if (data) 
                {                	
                	var session = data;
                	session.remove();
                	res.statusCode = 203;
                	res.send('OK');            	                   
                } 
                else
                {
                	res.statusCode = 404;
	            	res.send('Not found');
                } 
        	}
        );
    };
    
    exports.getSession = function(req, res, next) 
    {
    	if ('OPTIONS' == req.method) 
    	{
    		res.statusCode = 203;
    		res.send('OK');
    	}
    	
    	var query = {token:req.body.token};
    	
    	Session.findOne(query).populate('user').exec
        (
        	function (arr, data) 
        	{
        		if (data) 
                {
                    var session = data;
                    
                    if( sessionLength > 0 
                    	&& session.expires.getTime() < Date.now() )
                    {
                    	session.remove();
                    	
                    	res.statusCode = 440;
    	            	res.send('Session expired');
                    }
                    else
                    {
                    	//	TODO: renew session expiration here?
                    	res.send( session.toObject() );
                    }
                } 
                else
                {
                	res.statusCode = 404;
	            	res.send('Not found');
                } 
        	}
        );
    };
    
    exports.getUser = function(req, res, next) 
    {
    	if ('OPTIONS' == req.method) 
    	{
    		res.statusCode = 203;
    		res.send('OK');
    	}
    	
    	var query = {};
    	
    	if( req.query.id ) 
    		query['_id'] = req.query.id;
    	
    	if( req.query.username ) 
    		query['username'] = req.query.username;
    	
    	User.findOne(query).exec
        (
        	function (arr, data) 
        	{
                if (data) 
                {
                    res.send(data);
                } 
                else
                {
                	res.statusCode = 404;
	            	res.send('Not found');
                } 
        	}
        );
    };

    exports.putUser = function (req, res, next) 
    {
    	if ('OPTIONS' == req.method) 
    	{
    		res.statusCode = 203;
    		res.send('OK');
    	}
        
        var data = req.body;
        data.password = encrypt(data.password);
        
        var user = new User();
    	user.nameFirst = data.name_first;
    	user.nameLast = data.name_last;
    	user.username = data.username;
    	user.password = data.password;
    	
        if (req.params && req.params[0]) 
        {
            User.find
            (
            	{
            		"username": data.username
            	}
            )
            .exec
            (
            	function (arr, data) 
            	{
            		if (data.length > 0) 
            		{
            			return next(new restify.InvalidArgumentError() );
            		} 
            		else 
            		{
            			user.save
            			(
            				function()
            				{
            					res.send(user);
            				}
            			)
            		}
            	}
            );
        } 
        else 
        {
        	user.save
    		(
    			function()
    			{
    				res.send(user);
    			}
    		)
        };
    };
}

var setSession = function(user,token)
{
	var expires;
	
	if( sessionLength > 0 )
	{
		expires = new Date();
	    expires.setTime( expires.getTime() + (sessionLength * 1000) );
	}
	else
	{
		expires = null;
	}
    
    var query = {user:user.id};
    
	Session.findOne(query).exec
    (
    	function (arr, data) 
    	{
            if (data) 
            {
                data.remove();
            }
    	}
    );
	
	var session = new Session();
	session.user = user._id;
	session.expires = expires;
	session.token = token;
	session.save
	(
		function(err)
		{
			if( err )
				console.log(err);
		}
	);
	
	console.log( session )
	return session;
};

var encrypt = function (string) {
    return crypto.createHash('md5').update(string).digest('hex');
};
