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

mongoose.model('User', UserSchema);
mongoose.model('Session', SessionSchema);