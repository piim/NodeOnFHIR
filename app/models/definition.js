var mongoose = require('mongoose'),Schema = mongoose.Schema;

var DefinitionComponentSchema = new Schema
(
	{
		label:String,
		code: String,
		codeName: String,
		codeURI: String,
		inputType:String,
		min:Number,
		max:Number
	}
);

var DefinitionSchema = new Schema
(
	{
		type: String,
		label: String,
		actionLabel: String,
		unit: String,
		unitLabel: String,
		code: String,
		codeName: String,
		codeURI: String,
		components: [DefinitionComponentSchema],
		chart: {style:String,allowPointSelect:Boolean,markerEnabled:Boolean}
	}
);

DefinitionComponentSchema.virtual('value').get(function(){return 0;});

mongoose.model('Definition', DefinitionSchema);