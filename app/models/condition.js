var mongoose = require('mongoose'),Schema = mongoose.Schema;

var Definition = mongoose.model('Definition'),
	Medication = mongoose.model('Medication');

<<<<<<< HEAD
var ConditionSchema = new Schema
(
	{
		name: String,
=======
var ConditionDefinitionSchema = new Schema
(
	{
		name: String,
		code: String,
		codeName: String,
		codeURI: String,
>>>>>>> deb20cc10a85e12f0ba824bf4e8493fc6dd5946b
		vitals: [{type: Schema.ObjectId,ref: 'Definition'}],
		medications: [{type: Schema.ObjectId,ref: 'Medication'}],
		customs: [{type: Schema.ObjectId,ref: 'Definition'}],
	}
);

<<<<<<< HEAD
mongoose.model('Condition', ConditionSchema);
=======
mongoose.model('ConditionDefinition', ConditionDefinitionSchema);
>>>>>>> deb20cc10a85e12f0ba824bf4e8493fc6dd5946b
