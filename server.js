/*
*	@author: Darshan
*	@version: 10-06-2015
*/
//Import frameworks,
var http = require("http");
var url = require("url");
var fs = require("fs");

//Base directory path for serving image files
var basePath = __dirname + "\\Images\\";

//Create Node JS's basic http server
//	@handleRequest is callback method for serving http requests
var server = http.createServer(handleRequest);

//Above created server will listen on port 9090
server.listen(9090, function() {
	console.log("Basic Node JS http server starter on port 9090");
});

//Callback function to handle http request
function handleRequest(req, res) {
	//Get http request method
	var reqMethod = req.method;

	//Proceed or allow only if 'GET' request method
	if(reqMethod != 'GET') {
		//Set error code to 400 in response header
		res.writeHead(400);
		res.end("Request method " + reqMethod + "not supported.");
	}

	//Get query string parameters from request URL
	var query = url.parse(req.url, true).query;

	//Get image file name from query string
	var imageName = query.imgName;

	//Fully qualified file name
	var filePath = basePath + imageName;

	//Check if the file with name exist on file system
	fs.exists(filePath, function(exists) {
		try {
			if(exists) {
				//If the file exist then pipe it to response
				var img = fs.readFileSync(filePath);
				res.writeHead(200, {'Content-Type': 'image/gif' });
				//fs.createReadStream(filePath).pipe(res);
				res.end(img, "binary");
			} else {
				//If the file does not exist then write 400 as response
				res.writeHead(400);
				res.write('<html><head><title>File Not Found</title></head><body><h1>400 File Not Found</h1><br/><hr/><br/>');
				res.write('The file you requested is not found.</body></html>');
				res.end();
			}
		} finally {
			res.end();
		}
	});
}