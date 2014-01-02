var mongoose = require('mongoose'), Schema = mongoose.Schema;

//  set schemas matching supported FHIR resource types
var MedicationSchema = new Schema({entry:{content:{Medication:{}}}});
mongoose.model('Medication', MedicationSchema);

var MedicationStatementSchema = new Schema({entry:{content:{MedicationStatement:{patient:{reference:{value:{}}}}}}});
mongoose.model('MedicationStatement', MedicationStatementSchema);

var MedicationAdministrationSchema = new Schema({entry:{content:{MedicationAdministration:{patient:{reference:{value:{}}}}}}});
mongoose.model('MedicationAdministration', MedicationAdministrationSchema);

var ObservationSchema = new Schema({entry:{content:{Observation:{subject:{reference:{value:{}}}}}}});
mongoose.model('Observation', ObservationSchema);

var OrganizationSchema = new Schema({entry:{content:{Organization:{}}}});
mongoose.model('Organization', OrganizationSchema);

var PatientSchema = new Schema({entry:{content:{Patient:{}}}});
mongoose.model('Patient', PatientSchema);

var PractitionerSchema = new Schema({entry:{content:{Practitioner:{}}}});
mongoose.model('Practitioner', PractitionerSchema);

var SubstanceSchema = new Schema({entry:{content:{Substance:{}}}});
mongoose.model('Substance', SubstanceSchema);

var TrackerStatementSchema = new Schema({entry:{content:{TrackerStatement:{}}}});
mongoose.model('TrackerStatement', TrackerStatementSchema);

var VitalStatementSchema = new Schema({entry:{content:{VitalStatement:{}}}});
mongoose.model('VitalStatement', VitalStatementSchema);