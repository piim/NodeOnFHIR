var mongoose = require('mongoose'),Schema = mongoose.Schema;

var Definition = mongoose.model('Definition'),
	Medication = mongoose.model('Medication');

var ConditionSchema = new Schema
(
	{
		name: String,
		vitals: [{type: Schema.ObjectId,ref: 'Definition'}],
		medications: [{type: Schema.ObjectId,ref: 'Medication'}],
		customs: [{type: Schema.ObjectId,ref: 'Definition'}],
	}
);

mongoose.model('Condition', ConditionSchema);