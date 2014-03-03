var sqlite = require('sqlite3');
var http = require('http');

//var db = new sqlite.Database("hyperspec.sqlite");

http.createServer(function(request, response) { 
    console.log(request);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ lol: 'dongs' }));
}).listen(8899);

//console.log(sqlite);
