var mongoose = require('mongoose'), Schema = mongoose.Schema;

var CodeSchema = {value:{type:Schema.Types.Mixed}};

var ValueSchema = {value:{type:Schema.Types.Mixed}};

var CodingSchema = {system:ValueSchema,code:CodeSchema,display:ValueSchema};
mongoose.model('Coding', CodingSchema);

var CodeableConceptSchema = {coding:[CodingSchema],text:ValueSchema};

//  set schemas matching supported FHIR resource types
var ConditionSchema = new Schema
(
	{
		entry:
		{
			content:
			{
				Condition:
				{
					subject:{reference:ValueSchema},
					code:CodeableConceptSchema
				}
			}
		}
	}, 
	{ 
		strict: false 
	}
);
mongoose.model('Condition', ConditionSchema);

var MedicationSchema = new Schema({entry:{content:{Medication:{}}}}, { strict: false });
mongoose.model('Medication', MedicationSchema);

var MedicationStatementSchema = new Schema
(
	{
		entry:
		{
			content:
			{
				MedicationStatement:
				{
					patient:
					{
						reference:
						{
							value:{}
						}
					},
					medication:
					{
						reference:
						{
							value:{}
						}
					}
				},
			}
		}
	}, 
	{
		strict: false 
	}
);
mongoose.model('MedicationStatement', MedicationStatementSchema);

var MedicationAdministrationSchema = new Schema({entry:{content:{MedicationAdministration:{patient:{reference:{value:{}}}}}}}, { strict: false });
mongoose.model('MedicationAdministration', MedicationAdministrationSchema);

var ObservationSchema = new Schema({entry:{content:{Observation:{subject:{reference:{value:{}}}}}}}, { strict: false });
mongoose.model('Observation', ObservationSchema);

var OrganizationSchema = new Schema({entry:{content:{Organization:{}}}}, { strict: false });
mongoose.model('Organization', OrganizationSchema);

var PatientSchema = new Schema({entry:{content:{Patient:{}}}}, { strict: false });
mongoose.model('Patient', PatientSchema);

var PractitionerSchema = new Schema({entry:{content:{Practitioner:{}}}}, { strict: false });
mongoose.model('Practitioner', PractitionerSchema);

var SubstanceSchema = new Schema({entry:{content:{Substance:{}}}}, { strict: false });
mongoose.model('Substance', SubstanceSchema);

var TrackerStatementSchema = new Schema
(
	{
		entry:
		{
			content:
			{
				TrackerStatement:
				{
					author:
					{
						reference:
						{
							value:{}
						}
					},
					code:CodeableConceptSchema
				}
			}
		}
	}, 
	{ 
		strict: false 
	}
);
mongoose.model('TrackerStatement', TrackerStatementSchema);

var VitalStatementSchema = new Schema
(
	{
		entry:
		{
			content:
			{
				VitalStatement:
				{
					author:
					{
						reference:
						{
							value:{}
						}
					},
					code:CodeableConceptSchema
				}
			}
		}
	}, 
	{ 
		strict: false 
	}
);
mongoose.model('VitalStatement', VitalStatementSchema);

ConditionSchema.pre
(
	"save", 
	function(next) 
	{
		var self = this;
		var query = 
		{
			'entry.content.Condition.subject.reference.value' : this.entry.content.Condition.subject.reference.value,
			'entry.content.Condition.code.coding.code.value' : this.entry.content.Condition.code.coding[0].code.value
		};
		
		mongoose.model('Condition').findOne
		(
			query,
			function(err, results) 
			{
				if(err) 
		        {
		            next(err);
		        } 
		        else if(results) 
		        {
		        	self.invalidate('entry.content.Condition.subject.reference.value', "The condition is already registered for this user");
		        	
		        	next(new Error("The condition is already registered for this user"));
		        } 
		        else 
		        {
		            next();
		        }
		    }
		);
	}
);

MedicationStatementSchema.pre
(
	"save", 
	function(next) 
	{
		var self = this;
		var query = 
		{
			'entry.content.MedicationStatement.patient.reference.value' : this.entry.content.MedicationStatement.patient.reference.value,
			'entry.content.MedicationStatement.medication.reference.value' : this.entry.content.MedicationStatement.medication.reference.value
		};
		
		mongoose.model('MedicationStatement').findOne
		(
			query,
			function(err, results) 
			{
				if(err) 
		        {
		            next(err);
		        } 
		        else if(results) 
		        {
		        	self.invalidate('entry.content.MedicationStatement.subject.reference.value');
		        	
		        	next(new Error('This medication has already been added'));
		        } 
		        else 
		        {
		            next();
		        }
		    }
		);
	}
);

TrackerStatementSchema.pre
(
	"save", 
	function(next) 
	{
		var self = this;
		var query = 
		{
			'entry.content.TrackerStatement.author.reference.value' : this.entry.content.TrackerStatement.author.reference.value,
			'entry.content.TrackerStatement.code.coding.code.value' : this.entry.content.TrackerStatement.code.coding[0].code.value
		};
		
		mongoose.model('TrackerStatement').findOne
		(
			query,
			function(err, results) 
			{
				if(err) 
		        {
		            next(err);
		        } 
		        else if(results) 
		        {
		        	self.invalidate('entry.content.TrackerStatement.subject.reference.value');
		        	
		        	next(new Error('This tracker has already been added'));
		        } 
		        else 
		        {
		            next();
		        }
		    }
		);
	}
);

VitalStatementSchema.pre
(
	"save", 
	function(next) 
	{
		var self = this;
		var query = 
		{
			'entry.content.VitalStatement.author.reference.value' : this.entry.content.VitalStatement.author.reference.value,
			'entry.content.VitalStatement.code.coding.code.value' : this.entry.content.VitalStatement.code.coding[0].code.value
		};
		
		mongoose.model('VitalStatement').findOne
		(
			query,
			function(err, results) 
			{
				if(err) 
		        {
		            next(err);
		        } 
		        else if(results) 
		        {
		        	self.invalidate('entry.content.VitalStatement.subject.reference.value');
		        	
		        	next(new Error('This vital has already been added'));
		        } 
		        else 
		        {
		            next();
		        }
		    }
		);
	}
);
