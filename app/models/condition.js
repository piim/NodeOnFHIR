var mongoose = require('mongoose'),Schema = mongoose.Schema;

var Definition = mongoose.model('Definition'),
        Medication = mongoose.model('Medication');

var ConditionDefinitionSchema = new Schema
(
        {
                name: String,
                code: String,
                codeName: String,
                codeURI: String,
                vitals: [{type: Schema.ObjectId,ref: 'Definition'}],
                medications: [{type: Schema.ObjectId,ref: 'Medication'}],
                customs: [{type: Schema.ObjectId,ref: 'Definition'}],
        }
);

mongoose.model('ConditionDefinition', ConditionDefinitionSchema);