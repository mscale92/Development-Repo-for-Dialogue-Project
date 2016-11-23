var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var JWT = require('jsonwebtoken');
var app = express();
var ManagementClient = require('auth0').ManagementClient;
var AuthenticationClient = require('auth0').AuthenticationClient;
var stripe = require('stripe')(process.env.STRIPE_SK_TEST);
var cors = require('cors');



var charges = require('./src/js/charges.js');
var company = require('./src/js/company.js');
var creditCard = require('./src/js/creditCard.js');
var plans = require('./src/js/plans.js');
var users = require('./src/js/users.js');

// This middleware will parse the POST requests coming from an HTML form, and put the result in req.body.  Read the docs for more info!
app.use(bodyParser.json());
app.use(cors());


//This middleware will check for authentication on every page except the homepage
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

var auth0Connection = "Username-Password-Authentication";

var auth0 = new ManagementClient({
  token: process.env.AUTH0_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
});

var authentication0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
});


app.post('/api/signup', function(req, res){

  var companyName = req.body.companyName;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;

  /*
  Make sure that the key of q is between backticks,
  doubles are needed for internal strings, like "Mushroom Inc"
  */
  auth0.getUsers({q: `email: "${email}"`})
  .then(function (user) {
    if(user.length > 0){
      // throw new Error("User already exists.");
      res.status(401).send("User already exists.")
    }
    //Else, the user does not exist
    //Clear to go ahead and create a new customer on Stripe!
  })
  .then(function(){
    // Return the customer object from the stripe.customers.create promise function
    return stripe.customers.create({
      description: companyName,
      email: email,
    });
  })
  .then(customer => {
    /*
    Next using the customer object, grab the id value
    and assign it to a plan to create a new subscription.
    On signup each customer is on plan zero, a free plan, so as to not require a credit card, this will be updated later.
    */
    return stripe.subscriptions.create({
      customer: customer.id,
      plan: "zero"
    });
  })
  .then(subscription => {
    /*
    Next using the email, password, firstName, lastName, companyName and customerId
    obtained from the subscription object we signup a new user on Auth0
    */
    var customerId = subscription.customer;
    return auth0.createUser({
      connection: auth0Connection,
      email: email,
      password: password,
      user_metadata: {
        firstName: firstName,
        lastName: lastName,
      },
      app_metadata: {
        companyName: companyName,
        customerId: customerId,
        roles: ["admin", "employee"],
      },
    });
  })
  .then(user => {
    //Now we login the user to auth0 with their email, password, and define the scope of their JWT token
    return authentication0.oauth.signIn({
      grant_type: "password",
      connection: auth0Connection,
      username: email,
      password: password,
      scope: "openid app_metadata",
    });
  })
  .then(jwtObject => {
    res.json(jwtObject.id_token);
  })
  .catch(function (error) {
    // Handle error.
    res.status(500).send(error);
  });

  /*
  This endpoint will be called when we want to signup a new company to our system. We will receive this data (req.body):
    companyName, firstName, lastName, emailAddress, password
  The personal data we receive is for an employee known as the "HR Manager". We will add him to Auth0 as the admin user.

  1. Make a call to Auth0 to check if this email already exists. If it does, then send a 400 response
  2. Create a new customer on Stripe (using companyName and emailAddress)
  3. Create a new FREE subscription for this customer
  4. Signup a new Auth0 user with emailAddress and password and firstName lastName. In his app_metadata, set customerId to the customer ID from stripe and set roles: ['admin', 'employee']
  5. Do an Auth0 login call (scope=openid app_metadata) using emailAddress and password, and retrieve the id_token.
  6. Send a JSON response with {token: "THE TOKEN THAT YOU GOT FROM Auth0"}
  */
});

app.post('/api/login', function(req, res){
  // token()
  // console.log(auth0.deviceCredentials.resource.options.headers)
  /*
  1. Make a login call (scope=openid app_metadata) to Auth0 with emailAddress and password
  2. If login works, send a JSON with {token: "TOKEN FROM Auth0"}
  3. If login fails, send a 401 Unauthorized with the error message from Auth0
  */
  var email = req.body.email;
  var password = req.body.password;

  //CHECK ADMIN PROVILEDGES

  auth0.getUsers({q: `email: "${email}"`})
  .then(function(user){

    if(user[0].app_metadata.roles.indexOf("admin") < 0){
      // eventually send something to the app that tells the user that it's admins only
      //not just a console error
      res.status(401).send("Admins only");
    }
    else{
      return authentication0.oauth.signIn({
        grant_type: "password",
        connection: auth0Connection,
        username: email,
        password: password,
        scope: "openid app_metadata userId",
      })
    }
  })
  .then(jwtObject => {
    res.json(jwtObject.id_token);
  })
  .catch(error => {
    res.status(401).send(error);
  });

});

//Florent
//company.js
app.get('/api/company', function(req, res) {
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }
  1. Extract the customerId from the req.user
  2. Make a call to Stripe to retrieve this customer info by ID
  3. Send back a JSON response with {"name": "name of the company from stripe", and any other useful info}
  */
  var customerId = req.user.app_metadata.customerId;

  company.get(customerId)
    .then(companyInfo => {
      res.json(companyInfo);
    })
    .catch(function (error) {
      res.status(401).send(error);
    });


});

app.patch('/api/company', function(req, res) {
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the customerId from the req.user
  2. Make a call to Stripe to UPDATE this customer's description by ID, using the info from req.body
  3. Update company name in Auth0
  4. Send back a JSON response with {"name": "new name of the company", and any other useful info}
  */

  var customerId = req.user.app_metadata.customerId;
  var userId = req.user.sub; //corresponds to the user id
  var updatedCompanyName = req.body.updatedCompanyName;
  console.log(req.user);
  company.update(customerId, userId, updatedCompanyName)
  .then((updatedCompanyInfo)=>{
    res.json(updatedCompanyInfo);
  })
  .catch(function (error) {
    res.status(401).send(error);
  });

})

app.get('/api/users', function(req, res){
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the customerId from the req.user
  2. Make a call to Auth0 management API to list all users where app_metadata:company = that customerID
  3. Send back a JSON response with an array of users [{"id": "xxx", firstName: "xx", lastName: "xx", emailAddress: "xx", and any other field you deem necessary}]
  */
  var customerId = req.user.app_metadata.customerId;

  users.get(customerId)
  .then((users)=>{
    console.log(users, "banana")
    res.json(users);
  })
  .catch(function (error) {
    res.status(401).send(error);
  });
});

app.get('/api/users/:userId', function(req, res){

  users.getUser(req.params.userId)
  .then(user => {
    
    res.json(user);
  })
  .catch(error => {
    res.status(401).send(error);
  });
});

app.post('/api/users', function(req, res) {

  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the customerId from the req.user
  2. Make a call to Auth0 management API to create a new user with app_metadata: {customerId: "xxx", roles: [employee]}
  3. Make a call to Stripe to update the subscription of that customer and add 1 to the quantity of that sub
  4. Send back a JSON response with the info of the newly created user {id, firstName, lastName, emailAddress}
  */
  var customerId = req.user.app_metadata.customerId;
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  users.createUser(customerId, email, password, firstName, lastName)
  .then(updatedSub =>{
    res.json(updatedSub);
  })
  .catch(function (error) {
    res.status(401).send(error);
  });


});

app.patch('/api/users/:userId', function(req, res) {
  userId = req.params.userId;
  userData = req.body;


  users.update(userId, userData)
  .then( updatedUser =>{
    res.json(updatedUser);
  })
  .catch(function (error) {
    res.status(401).send(error);
  });
  
});

app.delete('/api/users/:userId', function(req, res) {

  var customerId = req.user.app_metadata.customerId;
  users.deleteUser(customerId, req.params.userId)
  .then( updatedSub =>{
    res.json(updatedSub);
  })
  .catch(function (error) {
    res.status(401).send(error);
  });
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the customerId from the req.user
  2. Make a call to Auth0 management API to delete the user by his userId
  3. Make a call to Stripe to remove 1 from the quantity of the customer's subscription
  4. Send back a JSON response with {success: true}
  */
});

app.get('/api/plans', function(req, res){
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Make a call to Stripe to get a list of all the plans
  2. Send back a JSON response with an array of plans
  */
  plans.getAll()
  .then(plans => {
    res.json(plans);
  })
  .catch(error => {
    res.status(401).send(error);
  })
});

app.get('/api/currentplan', function(req, res) {
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the customerId from the req.user
  2. Make a call to stripe to get the subscription of that customer
  3. Send back a JSON response with {"plan": "gold,..."}
  */
  var customerId = req.user.app_metadata.customerId;

  plans.getCurrent(customerId)
  .then(currentPlan => {
    res.json(currentPlan);
  })
  .catch(error => {
    res.status(401).send(error);
  })
});

app.put('/api/currentplan', function(req, res) {
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  This call will receive under req.body {plan: "silver"}

  1. Extract the customerId from the req.user
  2. Make a call to Stripe to update the subscription based on req.body.plan
  3. Send back a JSON response with {"plan": "new plan ID"}
  */

  var customerId = req.user.app_metadata.customerId;
  var planToUpdate = req.body.planToUpdate;

  plans.updateCurrent(customerId, planToUpdate)
    .then(updatedPlan => {
      console.log(updatedPlan);
      res.json(updatedPlan);
    })
    .catch(error => {
      res.status(401).send(error);
    });
});

app.get('/api/charges', function(req, res){
  res.send('TODO');
});

app.get('/api/creditcard', function(req, res) {
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  1. Extract the customerId from the req.user
  2. Make a call to Stripe to grab whatever we can about the customer's token (TO BE DETERMINED)
  3. Send back a JSON response with either {"card": null} if there's nothing, or {"card": {last4: "XXXX", whatever else you have}}
  */
  var customerId = req.user.app_metadata.customerId;

  //Get credit card data
  creditCard.get(customerId)
    .then(creditCard => {
      //Send current credit card
      if(!creditCard){
        res.json({doesNotExist: true});
      }
      else {
        res.json(creditCard);
      }
    })
    .catch(error => {
      res.status(401).send(error);
    });
});

//Florent
//creditCard.js
app.post('/api/creditcard', function(req, res) {
  /*
  This endpoint is "protected" by express-jwt. This middleware will add a req.user object with all the info from the user. It will lok a bit like this:

  {
    "userid": ".....",
    "app_metadata": {
      "customerId": "cus_95843295794" <<- coming from Stripe
      "roles": [...]
    }
  }

  This endpoint will simply receive under req.body {token: "token received from AJAX call to Stripe on the React App"}

  1. Extract the customerId from the req.user
  2. Make a call to Stripe to update or create a token for this company
  3. Send back a JSON response with {card: "whatever information you have"}
  */
  var customerId = req.user.app_metadata.customerId;
  var creditCardData = req.body;
  console.log(creditCardData);
  creditCard.get(customerId)
    .then(creditCardIsThere => {
      //If no card, create card
      if(creditCardIsThere === undefined){
        return creditCard.create(customerId, creditCardData)
      }
      else {
      //Else update card
        return creditCard.update(customerId, creditCardData)
      }
    })
    .then(finalCreditCardData => {
      //Send created/updated credit card data
      res.json(finalCreditCardData);
    })
    .catch(error => {
      res.status(401).send(error);
    });
});


app.listen(process.env.PORT || 1337, function() {
  console.log('Server started');
});
