var mongoose = require('mongoose'),Schema = mongoose.Schema;

var DefinitionComponentSchema = new Schema
(
	{
		label:String,
		code: String,
		codeName: String,
		codeURI: String,
		type:String,
		min:Number,
		max:Number,
		stepSize:Number,
		value:{type:Schema.Types.Mixed,default:0},
		values:[{code:String,label:String,codeName:String}]
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
		valueLabelDepth: {type:Number,default:1},
		code: String,
		codeName: String,
		codeURI: String,
		components: [DefinitionComponentSchema],
		chart: {style:String,allowPointSelect:Boolean,markerEnabled:Boolean}
	}
);

mongoose.model('Definition', DefinitionSchema);