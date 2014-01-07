var config = require('./config');

var mongoose = require('mongoose'),
	MedicationMongooseModel = mongoose.model('Medication'),
	MedicationStatementMongooseModel = mongoose.model('MedicationStatement'),
	MedicationAdministrationMongooseModel = mongoose.model('MedicationAdministration'),
	ObservationMongooseModel = mongoose.model('Observation'),
	OrganizationMongooseModel = mongoose.model('Organization'),
	PatientMongooseModel = mongoose.model('Patient'),
	PractitionerMongooseModel = mongoose.model('Practitioner'),
	SubstanceMongooseModel = mongoose.model('Substance'),
	TrackerStatementMongooseModel = mongoose.model('VitalStatement'),
	VitalStatementMongooseModel = mongoose.model('TrackerStatement');

module.exports = function(server)
{
	var fhir = require('../app/controllers/fhir');
	
	//	get all records
	server.get('/medication/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, MedicationMongooseModel, 'Medication');});
	server.get('/medicationadministration/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, MedicationAdministrationMongooseModel, 'MedicationStatement');});
	server.get('/medicationstatement/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, MedicationStatementMongooseModel, 'MedicationStatement');});
	server.get('/observation/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, ObservationMongooseModel, 'Observation');});
	server.get('/organization/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, OrganizationMongooseModel, 'Organization');});
	server.get('/patient/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, PatientMongooseModel, 'Patient');});
	server.get('/practitioner/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, PractitionerMongooseModel, 'Practitioner');});
	server.get('/substance/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, SubstanceMongooseModel, 'Substance');});
	server.get('/trackerstatement/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, TrackerStatementMongooseModel, 'TrackerStatement');});
	server.get('/vitalstatement/history', function(req, res, next){return fhir.getResourceHistory(req, res, next, VitalStatementMongooseModel, 'VitalStatement');});

	//		write new records
	server.put(/^\/medication\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.putResource(req, res, next, MedicationMongooseModel, 'Medication');});
	server.put(/^\/medicationadministration\/@([a-zA-Z0-9_\.~-]+)/,  function(req, res, next){return fhir.putResource(req, res, next, MedicationAdministrationMongooseModel, 'MedicationAdministration');});
	server.put(/^\/medicationstatement\/@([a-zA-Z0-9_\.~-]+)/,  function(req, res, next){return fhir.putResource(req, res, next, MedicationStatementMongooseModel, 'MedicationStatement');});
	server.put(/^\/observation\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.putResource(req, res, next, ObservationMongooseModel, 'Observation');});
	server.put(/^\/organization\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.putResource(req, res, next, OrganizationMongooseModel, 'Organization');});
	server.put(/^\/patient\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.putResource(req, res, next, PatientMongooseModel, 'Patient');});
	server.put(/^\/practitioner\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.putResource(req, res, next, PractitionerMongooseModel, 'Practitioner');});
	server.put(/^\/trackerstatement\/@([a-zA-Z0-9_\.~-]+)/,  function(req, res, next){return fhir.putResource(req, res, next, TrackerStatementMongooseModel, 'TrackerStatement');});
	server.put(/^\/vitalstatement\/@([a-zA-Z0-9_\.~-]+)/,  function(req, res, next){return fhir.putResource(req, res, next, VitalStatementMongooseModel, 'VitalStatement');});
	server.put('/medication', function(req, res, next){return fhir.putResource(req, res, next, MedicationMongooseModel, 'Medication');});
	server.put('/medicationadministration',  function(req, res, next){return fhir.putResource(req, res, next, MedicationAdministrationMongooseModel, 'MedicationAdministration');});
	server.put('/medicationstatement', function(req, res, next){return fhir.putResource(req, res, next, MedicationStatementMongooseModel, 'MedicationStatement');});
	server.put('/observation', function(req, res, next){return fhir.putResource(req, res, next, ObservationMongooseModel, 'Observation');});
	server.put('/organization', function(req, res, next){return fhir.putResource(req, res, next, OrganizationMongooseModel, 'Organization');});
	server.put('/patient', function(req, res, next){return fhir.putResource(req, res, next, PatientMongooseModel, 'Patient');});
	server.put('/practitioner', function(req, res, next){return fhir.putResource(req, res, next, PractitionerMongooseModel, 'Practitioner');});
	server.put('/trackerstatement', function(req, res, next){return fhir.putResource(req, res, next, TrackerStatementMongooseModel, 'TrackerStatement');});
	server.put('/vitalstatement', function(req, res, next){return fhir.putResource(req, res, next, VitalStatementMongooseModel, 'VitalStatement');});

	//		search
	server.get('/medication/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	                req,res,next,MedicationMongooseModel,'Medication',
	                [
	                 {id:"name",field:"name.value",search:[{regex:'^{{value}}.*'},{prefix:''}]}
	                ]
	            );
	});
	server.get('/medicationadministration/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	                req,res,next,MedicationAdministrationMongooseModel,'MedicationAdministration',
	                [
	                 {id:"patient_id",field:"patient.reference.value",search:[{prefix:'patient/@'}]}
	                ]
	            );
	});
	server.get('/medicationstatement/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	            req,res,next,MedicationStatementMongooseModel,'MedicationStatement',
	            [
	             {id:"patient_id",field:"patient.reference.value",search:[{prefix:'patient/@'}]}
	            ]
	    );
	});
	 
	server.get('/observation/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	            req,res,next,ObservationMongooseModel,'Observation',
	            [
	             {id:"subject",field:"subject.reference.value",search:[{prefix:'patient/@'}]},
	             {id:"performer",field:"performer.reference.value",search:[{regex:'((practitioner)|(patient))/@{{value}}'}]},
	             {id:"subject.name",field:"subject.display.value",search:[{regex:'{{value}}',flags:'i'}]},
	             {id:"performer.name",field:"performer.display.value",search:[{regex:'{{value}}',flags:'i'}]},
	             {id:"name",search:[{field:"name.coding.code.value"},{field:"name.coding.code.value"},{field:"name.coding.display.value",regex:'.*{{value}}.*',flags:'i'}]}
	            ],
	            "entry.content.{{resourceId}}.subject.reference.value"
	    );
	});
	server.get('/organization/search', function(req,res,next){
	    return fhir.searchResourceParams(
	            req,res,next,OrganizationMongooseModel,'Organization',
	            [
	             {id:"name",field:"name.value",search:[{regex:'^{{value}}.*'}]}
	            ]
	    );
	});
	server.get('/patient/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	            req,res,next,PatientMongooseModel,'Patient',
	            [
	             {id:"name",search:[{field:"name.family.value",regex:'^{{value}}.*'},{field:"name.given.value",regex:'^{{value}}.*'}]},
	             {id:"family",search:[{field:"name.family.value",regex:'^{{value}}.*'}]},
	             {id:"given",search:[{field:"name.given.value",regex:'^{{value}}.*'}]}
	            ]
	        );
	});
	server.get('/practitioner/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	            req,res,next,PractitionerMongooseModel,'Practitioner',
	            [
	             {id:"name",search:[{field:"name.family.value",regex:'^{{value}}.*'},{field:"name.given.value",regex:'^{{value}}.*',flags:'i'}]},
	             {id:"family",search:[{field:"name.family.value",regex:'^{{value}}.*',flags:'i'}]},
	             {id:"given",search:[{field:"name.given.value",regex:'^{{value}}.*',flags:'i'}]}
	            ]
	        );
	});
	server.get('/trackerstatement/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	            req,res,next,TrackerStatementMongooseModel,'TrackerStatement',
	            [
	             {id:"subject",field:"author.reference.value",search:[{prefix:'patient/@'}]}
	            ]
	    );
	});
	server.get('/vitalstatement/search', function(req,res,next) {
	    return fhir.searchResourceParams(
	            req,res,next,VitalStatementMongooseModel,'VitalStatement',
	            [
	             {id:"subject",field:"author.reference.value",search:[{prefix:'patient/@'}]}
	            ]
	    );
	});

	//		find specific records
	server.get(/^\/medication\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, MedicationMongooseModel, 'Medication');});
	server.get(/^\/medicationadministration\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, MedicationAdministrationMongooseModel, 'MedicationAdministration');});
	server.get(/^\/medicationstatement\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, MedicationStatementMongooseModel, 'MedicationStatement');});
	server.get(/^\/observation\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, ObservationMongooseModel, 'Observation');});
	server.get(/^\/organization\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, OrganizationMongooseModel, 'Organization');});
	server.get(/^\/patient\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, PatientMongooseModel, 'Patient');});
	server.get(/^\/practitioner\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, PractitionerMongooseModel, 'Practitioner');});
	server.get(/^\/substance\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, SubstanceMongooseModel, 'Substance');});
	server.get(/^\/trackerstatement\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, TrackerStatementMongooseModel, 'TrackerStatement');});
	server.get(/^\/vitalstatement\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.searchResource(req, res, next, VitalStatementMongooseModel, 'VitalStatement');});

	//		delete
	server.del(/^\/medicationadministration\/delete\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.deleteResource(req, res, next, MedicationAdministrationMongooseModel, 'MedicationAdministration');});
	server.del(/^\/medicationstatement\/delete\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.deleteResource(req, res, next, MedicationStatementMongooseModel, 'MedicationStatement');});
	server.del(/^\/trackerstatement\/delete\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.deleteResource(req, res, next, TrackerStatementMongooseModel, 'TrackerStatement');});
	server.del(/^\/vitalstatement\/delete\/@([a-zA-Z0-9_\.~-]+)/, function(req, res, next){return fhir.deleteResource(req, res, next, VitalStatementMongooseModel, 'VitalStatement');});

	//		recieve record dumps
	//  (corresponds to resources listed in test_data/load.sh import script)
	server.post('/medicationDump', function(req, res, next){return postDump(req,res,next,MedicationMongooseModel,'Medication');});
	server.post('/observationDump', function(req, res, next){return postDump(req,res,next,ObservationMongooseModel,'Observation');});
	server.post('/organizationDump', function(req, res, next){return postDump(req,res,next,OrganizationMongooseModel,'Organization');});
	server.post('/patientDump', function(req, res, next){return postDump(req,res,next,PatientMongooseModel,'Patient');});
	server.post('/practitionerDump', function(req, res, next){return postDump(req,res,next,PractitionerMongooseModel,'Practitioner');});
	server.post('/substanceDump', function(req, res, next){return postDump(req,res,next,SubstanceMongooseModel,'Substance');});

	//		user authentication
	if( config.authenticate )
	{
		var user = require('../app/controllers/user');
		
		server.put('/auth/user', user.putUser);
		server.put('/auth/^\/user\/@([a-zA-Z0-9_\.~-]+)/', user.putUser);
		server.post('/auth/login', user.postAuthenticate);
		server.post('/auth/session', user.getSession);
		server.get('/user/search', user.getUser);
	}
	
	var definition = require('../app/controllers/definition');
	
	server.get('/definition/search', definition.search);
}
