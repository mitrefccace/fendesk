// This is the main JS for the fendesk RESTFul server
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var clear = require('clear');
var log4js = require('log4js');
var nconf = require('nconf');
var cfile = null;
var ip = require("ip");

// Initialize log4js
log4js.loadAppender('file');
var logname = 'fendesk';
log4js.configure({
	appenders: [
		{
			type: 'dateFile',
			filename: 'logs/' + logname + '.log',
			alwaysIncludePattern: false,
			maxLogSize: 20480,
			backups: 10
		}
	]
});

// Get the name of the config file from the command line (optional)
nconf.argv().env();

cfile = 'config.json';

//Validate the incoming JSON config file
try {
	var content = fs.readFileSync(cfile,'utf8');
	var myjson = JSON.parse(content);
	console.log("Valid JSON config file");
} catch (ex) {
	console.log("Error in " + cfile);
	console.log('Exiting...');
	console.log(ex);
	process.exit(1);
}

var logger = log4js.getLogger(logname);

nconf.file({file: cfile});
var configobj = JSON.parse(fs.readFileSync(cfile,'utf8'));

// Set log4js level from the config file
logger.setLevel(decodeBase64(nconf.get('debuglevel')));
logger.trace('TRACE messages enabled.');
logger.debug('DEBUG messages enabled.');
logger.info('INFO messages enabled.');
logger.warn('WARN messages enabled.');
logger.error('ERROR messages enabled.');
logger.fatal('FATAL messages enabled.');
logger.info('Using config file: ' + cfile);


var credentials = {
	key: fs.readFileSync(decodeBase64(nconf.get('https:private_key'))),
	cert: fs.readFileSync(decodeBase64(nconf.get('https:certificate')))
};

// Start the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/apidoc',express.static(__dirname + '/apidoc'));
app.use(bodyParser.json({type: 'application/vnd/api+json'}));

var routes = require('./routes/routes.js')(app,fs,ip,decodeBase64(nconf.get('port')));
var httpsServer = https.createServer(credentials,app);
httpsServer.listen(parseInt(decodeBase64(nconf.get('port'))));
console.log('HTTPS Fendesk server running on port=%s   (Ctrl+C to Quit)', parseInt(decodeBase64(nconf.get('port'))));


// Handle Ctrl-C (graceful shutdown)
process.on('SIGINT', function() {
  console.log('Exiting...');
  process.exit(0);
});

/**
 * Function to decode the Base64 configuration file parameters.
 * @param {type} encodedString Base64 encoded string.
 * @returns {unresolved} Decoded readable string.
 */
function decodeBase64(encodedString) {

    var decodedString = new Buffer(encodedString, 'base64');

    return(decodedString.toString());
}
