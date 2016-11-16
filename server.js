var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');

var app = express();

// This middleware will parse the POST requests coming from an HTML form, and put the result in req.body.  Read the docs for more info!
app.use(bodyParser.urlencoded({extended: true}));

app.use(
  jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID}
  ).unless({path:['/api/signup', '/api/login']}),
  function(error, req, res, next) {
  // an error handling callback
  if(error){
    console.log(error, "not logged in!");
    res.status(401).send("Unauthorized!");
  }
});

app.post('/api/signup', function(req, res){
  res.send('TODO');
  /*
  This endpoint will be called when we want to signup a new company to our system. We will receive this data (req.body):
    companyName, firstName, lastName, emailAddress, password
  The personal data we receive is for an employee known as the "HR Manager". We will add him to Auth0 as the admin user.

  1. Make a call to Auth0 to check if this email already exists. If it does, then send a 400 response
  2. Create a new customer on Stripe (using companyName and emailAddress)
  3. Create a new FREE subscription for this customer
  4. Signup a new Auth0 user with emailAddress and password and firstName lastName. In his app_metadata, set companyId to the customer ID from stripe and set roles: ['admin', 'employee']
  5. Do an Auth0 login call (scope=openid app_metadata) using emailAddress and password, and retrieve the id_token.
  6. Send a JSON response with {token: "THE TOKEN THAT YOU GOT FROM Auth0"}
  */
});

app.post('/api/login', function(req, res){
  res.send('TODO');

  /*
  1. Make a login call (scope=openid app_metadata) to Auth0 with emailAddress and password
  2. If login works, send a JSON with {token: "TOKEN FROM Auth0"}
  3. If login fails, send a 401 Unauthorized with the error message from Auth0
  */
});

app.get('/api/company', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the companyId from the req.user
  2. Make a call to Stripe to retrieve this customer info by ID
  3. Send back a JSON response with {"name": "name of the company from stripe", and any other useful info}
  */


});
app.patch('/api/company', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the companyId from the req.user
  2. Make a call to Stripe to UPDATE this customer info by ID, using the info from req.body
  3. Send back a JSON response with {"name": "new name of the company", and any other useful info}
  */
})

app.get('/api/users', function(req, res){
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the companyId from the req.user
  2. Make a call to Auth0 management API to list all users where app_metadata:company = that company ID
  3. Send back a JSON response with an array of users [{"id": "xxx", firstName: "xx", lastName: "xx", emailAddress: "xx", and any other field you deem necessary}]
  */
});
app.post('/api/users', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the companyId from the req.user
  2. Make a call to Auth0 management API to create a new user with app_metadata: {companyId: "xxx", roles: [employee]}
  3. Make a call to Stripe to update the subscription of that customer and add 1 to the quantity of that sub
  4. Send back a JSON response with the info of the newly created user {id, firstName, lastName, emailAddress}
  */
});
app.patch('/api/users/:userId', function(req, res) {
  res.send('TODO');
  // NOT FOR NOW, WE ARE NOT UPDATING USERS YET
});
app.delete('/api/users/:userId', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the companyId from the req.user
  2. Make a call to Auth0 management API to delete the user by his userId
  3. Make a call to Stripe to remove 1 from the quantity of the customer's subscription
  4. Send back a JSON response with {success: true}
  */
});

app.get('/api/plans', function(req, res){
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Make a call to Stripe to get a list of all the plans
  2. Send back a JSON response with an array of plans
  */
});
app.get('/api/currentplan', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the companyId from the req.user
  2. Make a call to stripe to get the subscription of that customer
  3. Send back a JSON response with {"plan": "gold,..."}
  */
});
app.put('/api/currentplan', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  This call will receive under req.body {plan: "silver"}

  1. Extract the companyId from the req.user
  2. Make a call to Stripe to update the subscription based on req.body.plan
  3. Send back a JSON response with {"plan": "new plan ID"}
  */
});

app.get('/api/charges', function(req, res){
  res.send('TODO');
});
app.get('/api/creditcard', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the companyId from the req.user
  2. Make a call to Stripe to grab whatever we can about the customer's token (TO BE DETERMINED)
  3. Send back a JSON response with either {"card": null} if there's nothing, or {"card": {last4: "XXXX", whatever else you have}}
  */
});
app.post('/api/creditcard', function(req, res) {
  res.send('TODO');
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "companyId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  This endpoint will simply receive under req.body {token: "token received from AJAX call to Stripe on the React App"}

  1. Extract the companyId from the req.user
  2. Make a call to Stripe to update or create a token for this company
  3. Send back a JSON response with {card: "whatever information you have"}
  */
});


app.listen(process.env.PORT || 1337, function() {
  console.log('Server started');
});
