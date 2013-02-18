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
    //var id = urlObj.query.id;
    var output = urlObj.query.output;
    //var user = 'kgaddy';
    request.addListener('end',
    function() {
		console.log(urlObj)
		//var serviceid = id;
 		//mock.getData(serviceid,response,request,output);
    });
}).listen(8001);
console.log('Log Server Started:8001')



var Log = (function () {
    function Log(date,code,description,ip,value,refId) {
        this.Date = date;
		this.Code = code
		this.Description = description;
		this.IPAddress = ip;
		this.Value = value;
		this.RefId = refId;
    }
    Log.prototype.logValue = function () {
	    //check the connection. If connected move on, else make the connection.
	    //if (client.connected === false) {
	   //         ClientConnectionReady(client);
	   // }
	  //  else
	  //  {
	    //    ClientConnectionReady(client);
	  //  }
	  
	  connection.connect(function(err) {
		  console.log('connected')
	    // connected! (unless `err` is set)
	  });

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
	        var values = [this.Date, this.Code, this.Description, this.IPAddress,this.Value,this.RefId];
	        client.query('INSERT INTO log SET date = ? , code = ? , description =? , value=?, refId=?', values,
	        function(error, results) {
	            if (error) {
	                console.log("ClientReady Error: " + error.message);
	                client.end();
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


