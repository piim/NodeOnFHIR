exports.creds = {
  mongoose_auth_local: 'mongodb://localhost/patient-tracker',
};

exports.local_port = 8888;

exports.authenticate = true;   //  whether to enable user authentication (login)
exports.authorize = true;      //  whether to enable user authorization (controlled access to resources) (only valid if authenticate=true)
exports.authentication_secret = "xxx";