var qs = require('querystring');
var config = require('./config.js'),
	http = require('http'),
	sys = require('util'),
	url = require('url'),
	mysql = require('mysql');

var server = http.createServer(function(request, response) {
	var body = '';
	var POST;
	var parts = url.parse(request.headers['host'], true);
	var date, code, descr, ip, value, refId, output, urlObj;
	var urlObj = url.parse(request.url, true);

	request.on('data', function(d) {
		console.info('GET result:\n');
		process.stdout.write(d);
		console.info('\n\nCall completed');
		body += d;
	});
	/*
	if (urlObj.query.code != null) {
		//urlObj = url.parse(request.url, true),
		date = urlObj.query.date,
		code = urlObj.query.code,
		descr = urlObj.query.descr,
		ip = request.headers['user-agent'],
		value = urlObj.query.value,
		refId = urlObj.query.refId,
		output = urlObj.query.output;
	} else {
		//console.log(parts['query']);
		date = parts['query'].date;
		code = parts['query'].code;
		descr = parts['query'].descr;
		ip = "";
		value = parts['query'].value;
		refId = parts['query'].refId;
	}
	*/


	if (refId === '' || refId == null) {
		refId = '';
	}
	if (date === '' || date == null) {
		var now = new Date();
		date = now;
	}
	if (value === '' || value == null) {

		value = '';
	}

	request.on('end', function() {
		POST = qs.parse(body);
		if (POST.refId === '' || POST.refId == null) {
			POST.refId = '';
		}
		if (POST.date === '' || POST.date == null) {
			var now = new Date();
			POST.date = now;
		}
		if (POST.value === '' || POST.value == null) {

			POST.value = '';
		}
		var log = new Log(date, POST.code, POST.descr, request.headers['user-agent'], POST.value, POST.refId);
		log.logValue();


	});

	var resp = {success:'yes'};
	response.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': "*"
	});
	response.write(JSON.stringify(resp));
	response.end();



	request.resume();
}).listen(8001);
console.log('Log Server Started:8001')

//connect to mysql	
var connection = mysql.createConnection({
	host: 'localhost',
	user: config.MYSQLusername,
	password: config.MYSQLpassword,
	port: config.MYSQLport,
	database: config.MYSQLdbname
});

var Log = (function() {
	function Log(date, code, description, ip, value, refId) {
		this.DateLog = date;
		this.Code = code
		this.Description = description;
		this.IPAddress = ip;
		this.Value = value;
		this.RefId = refId;

	}
	Log.prototype.logValue = function() {
		var that = this;
		connection.connect(function(err) {
			console.log('connected');
			ClientConnectionReady(connection);
			// connected! (unless `err` is set)
		});

		function ClientConnectionReady(connection) {
			try {
				connection.query('USE Log',
					function(error, results) {
						if (error) {
							console.log('ClientConnectionReady Error: ' + error.message);
							//connection.end();
							return;
						}
						ClientReady(connection);
					});
			} catch (err) {
				console.log(err)
			}
		};

		function ClientReady(connection) {
			if (!that.IPAddress) {
				that.IPAddress = '';
			}

			if (that.Code === 'error') {

				var values = [that.DateLog, that.Code, that.Description, that.IPAddress, that.RefId];
				connection.query('INSERT INTO error SET date = ? , code = ? , msg =? , ipAddress = ?, refId=?', values,
					function(error, results) {
						if (error) {
							console.log("ClientReady Error: " + error.message);
							//connection.end();
							return;
						}
					});
			} else {
				var values = [that.DateLog, that.Code, that.Description, that.IPAddress, that.Value, that.RefId];
				connection.query('INSERT INTO log SET date = ? , code = ? , description =? , ipAddress = ?, value=?, refId=?', values,
					function(error, results) {
						if (error) {
							console.log("ClientReady Error: " + error.message);
							//connection.end();
							return;
						}
					});
			}

		}
	};
	return Log;
})();