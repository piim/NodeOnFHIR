var mongoose = require('mongoose'),Schema = mongoose.Schema;

var UserSchema = new Schema
(
	{
		nameFirst: String,
		nameLast: String,
		username: {
			type: String,
			unique: true
		},
		password:String,
		created: {
			type: Date,
			default: Date.now
		}
	}
);

mongoose.model('User', UserSchema);

var SessionSchema = new Schema
(
	{
		user: {
	        type: Schema.ObjectId,
	        ref: 'User'
	    },
	    token: String,
	    expires: Date
	}
);

mongoose.model('Session', SessionSchema);