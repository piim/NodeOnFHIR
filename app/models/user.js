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
		},
		lastLogin: {
			type: Date
		}
	},
	{
		toJSON: {virtuals:true},
		toObject: {virtuals:true}
	}
);

UserSchema.virtual('isNew').get(function(){ return this.lastLogin == undefined;} );

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
	},
	{
		toJSON: {virtuals:true},
		toObject: {virtuals:true}
	}
);

mongoose.model('Session', SessionSchema);