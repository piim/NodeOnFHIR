var mongoose = require('mongoose'),
	crypto = require('crypto'),
	jwt = require('jwt-simple'),
	url = require('url'),
	config = require('../../config/config');

var User = mongoose.model('User'),Session = mongoose.model('Session');

if( config.authenticate ) 
{
    exports.postAuthenticate = function (req, res, next) 
    {
        if ('OPTIONS' == req.method)
            res.send(203, 'OK');
        
        var request = JSON.parse(req.body);
        var username = request.username;
        var password = request.password;

        query = { "username": username, "password": encrypt(password) };
        
        console.log( query )
        User.findOne(query).execFind
        (
        	function (arr, data) 
        	{
	            if (data.length) 
	            {
	                var user = data[0];
	                var response = {user:user};
	                var token = jwt.encode({id: data[0]._id}, config.authentication_secret);
	                
	                response.id = data[0]._id;
	                response.token = token;
	                
	                var session = setSession(user,token);
	                res.send(response);
	            } else
	                res.send(404, 'Not found');
        });
    };
    
    exports.getSession = function(req, res, next) 
    {
    	if ('OPTIONS' == req.method) 
    		 res.send(203, 'OK');
    	 
    	var request = JSON.parse(req.body);
        var token = request.token;
        
    	var query = {token:token};
    	
    	console.log( request );
    	
    	Session.findOne(query).execFind
        (
        	function (arr, data) 
        	{
                if (data && data.length) 
                {
                    var session = data[0];
                    
                    if( session.expires.getTime() > Date.now )
                    {
                    	session.remove();
                    	res.send(404, 'Not found');
                    }
                    
                    res.send(session);
                } 
                else
                {
                	res.send(404, 'Not found');
                } 
        	}
        );
    };
    
    exports.getUser = function(req, res, next) 
    {
    	if ('OPTIONS' == req.method) 
    		 res.send(203, 'OK');
    	
    	var params = url.parse(req.url,true).query;
        
    	var query = {};
    	
    	if( params.id ) 
    		query['_id'] = params.id;
    	
    	if( params.username ) 
    		query['username'] = params.username;
    	
    	Session.findOne(query).execFind
        (
        	function (arr, data) 
        	{
                if (data && data.length) 
                {
                    res.send(data[0]);
                } 
                else
                {
                	res.send(404, 'Not found');
                } 
        	}
        );
    };

    exports.putUser = function (req, res, next) 
    {
        if ('OPTIONS' == req.method) 
            res.send(203, 'OK');
        
        var data = JSON.parse(req.body);
        data.password = encrypt(data.password);
        
        console.log( 'putUser', data );
        
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
	var minute = 1000 * 60;
    var hour = minute * 60;
    
    var expires = new Date();
    expires.setTime( expires.getTime() + (minute*5) );
    
    var query = {user:user.id};
    
	Session.findOne(query).execFind
    (
    	function (arr, data) 
    	{
            if (data.length) 
            {
                data[0].remove();
            }
    	}
    );
	
	console.log( 'session expires at', expires );
	
	var session = new Session();
	session.user = user;
	session.expires = expires;
	session.token = token;
	session.save();
	
	return session;
};

var encrypt = function (string) {
    return crypto.createHash('md5').update(string).digest('hex');
};
