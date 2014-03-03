var sqlite = require('sqlite3');
var http = require('http');
var url = require('url');

var db = new sqlite.Database("hyperspec.sqlite");
var sql = "select key, term, definition from glossary where key = ?";
var stmt = db.prepare(sql);

http.createServer(function(request, response) { 
    var terms = [];
    var query = url.parse(request, true).query;

    for (var k in Object.keys(query)) {
	stmt.reset();
	stmt.get(query[k], function(e, row) { 
	    terms.push(row);
	});
    }

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(terms));
}).listen(8899);


