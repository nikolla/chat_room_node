var http = require('http')
, fs = require('fs')
, path = require('path')
, cache = {};

// Create the error message 

function send404(res) {
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.write('Error 404: resource not found.');
	res.end();
} 

// This second function handles serving file data

function sendFile(res, filePath, fileContents) {
	res.writeHead(
		200,
		{"Content-Type": mime.lookup(path.basename(filePath))}
    );
    res.end(fileContents);
}

// Determines whether file is cached or not
// send error if it is not

function serveStatic(res, cache, absPath) {
	if (cache[absPath]) {
		sendFile(res, absPath, cache[absPath]);
	} else {
		// check if file exists
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if(err) {
						send404(res);
					} else {
						cache[absPath] = data;
						sendFile(res, absPath, data);
					}
				});
			} else {
				send404(res);
			}
		});
	}
}

// creating the server

var server = http.createServer(function(req, res) {
	var filePath = false;

	if (request.url = '/') {
		filePath = 'public/index.html';
	} else {
		// translate URL path to relative file path
		filePath = 'public' + request.url;
	}
	var absPath = './' + filePath;
	// static file
	serveStatic(res, cache, absPath);
});
// start the server
server.listen(3000, function() {
	console.log("Server listening on port 3000.")
})

// Now would be a good time to test it out.