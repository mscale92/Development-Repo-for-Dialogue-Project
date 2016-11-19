var request = require("request");
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// This middleware will parse the POST requests coming from an HTML form, and put the result in req.body.  Read the docs for more info!
app.use(bodyParser.urlencoded({extended: false}));

var options = {
	"client_id:" process.env.AUTH0_CLIENT_ID,
 	"client_secret" :process.env.AUTH0_CLIENT_SECRET,
  	"audience": AUTH0_DOMAIN + "api/v2/",
  	"grant_type":"client_credentials",
  };


app.get('/', function(req, res){
	return getPromise(options)
	.then(function(token){
		console.log(typeof token);
	
		var client = {
			method: 'GET',
			url: 'https://mscale.auth0.com/api/v2/users',
			headers: {
				authorization: token.token_type + " " + token.access_token
			}
		};

		return getPromise(client)
		.then(function(result){
			console.log(result);
			res.send("hola");
		});
	})
	.catch(function(err){
		console.log("there was an error ", err);
	});
});







// our old getPromise function, tried and true
  // uses a url, or object with headers to request!
function getPromise(url){
    return(
        new Promise(function(resolve, reject){
            request(url, function(err, result, body){
                if(err){
                    reject(err);
                }
                else{
                	body = JSON.parse(body);
                    resolve(body);
                }
            });
        })
    );
}



app.listen(process.env.PORT || 1337, function() {
  console.log('Server started');
});