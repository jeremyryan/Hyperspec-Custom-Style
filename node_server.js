var sqlite = require('sqlite3');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var db = new sqlite.Database("hyperspec.sqlite");
var sql = "select key, term, definition from glossary where key = ?";
var stmt = db.prepare(sql);

http.createServer(function(request, response) { 
    var terms = [];
    var query;

    request.on('data', function(data) { 
	query = querystring.parse(data + '');	
    });	

    request.on('end', function() { 
	var vals = query['d[]'];
	for (var i = 0, l = vals.length; i < l; i++) {
	    stmt.reset();
	    stmt.get(vals[i], function(e, row) { 
		terms.push(row);
		if (i === l) {
		    response.writeHead(200,
				       { 'Content-Type': 'application/json' });
		    response.end(JSON.stringify(terms));
		    db.close();
		}
	    });
	}
    });
}).listen(8899);


