var config = require('./config.js');
//var client = new require("mysql");
//client.createClient({host:'localhost',port:config.MYSQLport,user: config.MYSQLusername,password:config.MYSQLpassword,database: config.MYSQLdbname});

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : config.MYSQLusername,
  password : config.MYSQLpassword,
  port : config.MYSQLport,
  database: config.MYSQLdbname
});

var http = require('http');
var sys = require ('util');
var url = require('url');

var server = http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true);
    var date = urlObj.query.date;
	var code = urlObj.query.code;
	var descr = urlObj.query.descr;
	var ip = request.headers['user-agent'];
	var value = urlObj.query.value;
	var refId = urlObj.query.refId;
    var output = urlObj.query.output;

    request.addListener('end',
    function() {
		var log = new Log(date,code,descr,ip,value,refId);
		console.log(log)
		log.logValue();
		//var serviceid = id;
 		//mock.getData(serviceid,response,request,output);
    });
}).listen(8001);
console.log('Log Server Started:8001')



var Log = (function () {
    function Log(date,code,description,ip,value,refId) {
        this.DateLog = date;
		this.Code = code
		this.Description = description;
		this.IPAddress = ip;
		this.Value = value;
		this.RefId = refId;
    }

    Log.prototype.logValue = function () {
			var that=this;
	    //check the connection. If connected move on, else make the connection.
	    if (connection.connected === false) {
	            ClientConnectionReady(connection);
	    }
	    else
	    {
	        ClientConnectionReady(connection);
	   }
	  
	  connection.connect(function(err) {
		  console.log('connected')
	    // connected! (unless `err` is set)
	  });

	    function ClientConnectionReady(connection)
	    {
	        connection.query('USE Log',
	        function(error, results) {
	            if (error) {
	                console.log('ClientConnectionReady Error: ' + error.message);
	                connection.end();
	                return;
	            }
	            ClientReady(connection);
	        });
	    };

	    function ClientReady(connection)
	    {
	
	        var values = [that.DateLog, that.Code, that.Description, that.IPAddress,that.Value,that.RefId];
			console.log(values);
	        connection.query('INSERT INTO log SET date = ? , code = ? , description =? , ipAddress = ?, value=?, refId=?', values,
	        function(error, results) {
	            if (error) {
	                console.log("ClientReady Error: " + error.message);
	                connection.end();
	                return;
	            }

	        });
	    }
    };
    return Log;
})();


/*

exports.logService = function(request, userName, serviceid, numberOfRows) {











    //check the connection. If connected move on, else make the connection.
    if (client.connected === false) {
            ClientConnectionReady(client);
    }
    else
    {
        ClientConnectionReady(client);
    }

    function ClientConnectionReady(client)
    {
        client.query('USE mockJSON',
        function(error, results) {
            if (error) {
                console.log('ClientConnectionReady Error: ' + error.message);
                client.end();
                return;
            }
            ClientReady(client);
        });
    };

    function ClientReady(client)
    {
        var userAgent = request.headers['user-agent'];
        var svcId;

        if (serviceid)
        {
            svcId = serviceid;
        }
        else {
            svcId = 0;
        }
        var values = [userName, userAgent, svcId,numberOfRows];
        client.query('INSERT INTO Service_Log SET user = ? , userAgent = ? , serviceId =? , numberOfRows=?', values,
        function(error, results) {
            if (error) {
                console.log("ClientReady Error: " + error.message);
                client.end();
                return;
            }

        });
    }
}
*/


