var mongoose = require('mongoose'), Schema = mongoose.Schema;

//  set schemas matching supported FHIR resource types
var MedicationSchema = new Schema({entry:{content:{Medication:{}}}}, { strict: false });
mongoose.model('Medication', MedicationSchema);

var MedicationStatementSchema = new Schema({entry:{content:{MedicationStatement:{patient:{reference:{value:{}}}}}}}, { strict: false });
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

var TrackerStatementSchema = new Schema({entry:{content:{TrackerStatement:{}}}}, { strict: false });
mongoose.model('TrackerStatement', TrackerStatementSchema);

var VitalStatementSchema = new Schema({entry:{content:{VitalStatement:{}}}}, { strict: false });
mongoose.model('VitalStatement', VitalStatementSchema);