// These are loaded node modules
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var JWT = require('jsonwebtoken');
var app = express();
var ManagementClient = require('auth0').ManagementClient;
var AuthenticationClient = require('auth0').AuthenticationClient;
var stripe = require('stripe')(process.env.STRIPE_SK_TEST);
var cors = require('cors');


//These are our personal modules
var charges = require('./src/js/charges.js');
var company = require('./src/js/company.js');
var creditCard = require('./src/js/creditCard.js');
var plans = require('./src/js/plans.js');
var users = require('./src/js/users.js');

// This middleware will parse the POST requests coming from an HTML form, and put the result in req.body.  Read the docs for more info!
app.use(bodyParser.json());
// This middleware enables us to send requests between our two domains 3000 and 1337
app.use(cors());


//This middleware will check for authentication on every page except the login and signup pages
  // All other endpoints are "protected" by express-jwt
  // This middleware will add a req.user object with all the info from the logged in admin user
app.use(
  jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID}
  ).unless({path:['/api/signup', '/api/login']}),
  function(error, req, res, next) {
  // An error handling callback
  if(error){
    // All Errors are consistently sent to the browser in this form:
      /*
      Status of the error
      Message "ERROR", never changes
      Sub that holds the error details
      */
    res.status(401).json({status: 401, message: "ERROR", sub: error, });
  }
});

// This variable is used for auth0 connection types
var auth0Connection = "Username-Password-Authentication";

// Here we make a new Management Client using data from the .env file; Token and Domain
  // All management requests, like signup, use auth0
var auth0 = new ManagementClient({
  token: process.env.AUTH0_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
});

// Here we make anew Authentication Client using data from the .env file; Domain and Client ID
  // All authentication requests, like login, use authentication0
var authentication0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
});


// Signup
app.post('/api/signup', function(req, res){
  /*
  This endpoint will be called when we want to signup a new company to our system. We will receive this data (req.body):
    companyName, firstName, lastName, emailAddress, password
  The personal data we receive is for an employee known as the "HR Manager"
  They are added to Auth0 as the admin user
  */

  // Set req.body values to variables for simplicity
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
      res.status(401).json({status: 401, message: "ERROR", sub: "User already exists!!", });
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
    On signup each customer is on plan zero, a free plan, so as to not require a credit card
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
    // Send the id_token to the browser as a json file
    res.json(jwtObject.id_token);
  })
  .catch(function (error) {
    // Handle error
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });

});
// End of Signup


// Login
app.post('/api/login', function(req, res){
  /*
  This endpoint logs an admin into the app
  */

  // Set the req.body values to variables for simplicity
  var email = req.body.email;
  var password = req.body.password;

  // Use auth0, management, to make a request to auth0 to retrieve all users, with a search query as well
  auth0.getUsers({q: `email: "${email}"`})
  .then(function(user){
    // If the user does not have the admin value in their app_metadata, they will not be able to log in
      //This protects the app and keeps the users with access as admins only 
    if(user[0].app_metadata.roles.indexOf("admin") < 0){
      res.status(401).json({status: 401, message: "ERROR", sub: "Admins only!", });
    }
    else{
      // If they are an admin, send an authentication request to auth0 with signin credentials
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
    // If loging is successful, return an id_token to the browser
    res.json(jwtObject.id_token);
  })
  .catch(error => {
   res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });

});
// End of Login


// Get Company
app.get('/api/company', function(req, res) {
 //This endpoint retrieves the company name from stripe API

 // Set the req.user value to a variable for simplicity
  var customerId = req.user.app_metadata.customerId;

  // Using the company module and the get function, send a get request to Stripe
  company.get(customerId)
    .then(companyInfo => {
      res.json(companyInfo);
    })
    .catch(function (error) {
      res.status(500).json({status: 500, message: "ERROR", sub: error, });
    });

});
// End of Get Company


// Patch Company
app.patch('/api/company', function(req, res) {
  /*
  This endpoint is used to update the name of a company with a patch request
  */

  //The customerId is used to update the company description in stripe
  var customerId = req.user.app_metadata.customerId;
  //req.user.sub corresponds to the user id in auth0
  var userId = req.user.sub; 
  var updatedCompanyName = req.body.updatedCompanyName;

  // Access the company module with the update function to send a patch request to auth0 and an update to stripe
  company.update(customerId, userId, updatedCompanyName)
  .then((updatedCompanyInfo)=>{
    // Return the updated information to the browser
    res.json(updatedCompanyInfo);
  })
  .catch(function (error) {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });

});
// End of Patch Company


// Get All Users
app.get('/api/users', function(req, res){
  /*This endpoint retrieves all of the users from a shared company
    Each employee has a customerId that associates them with their company
  */

  // The customerId from req.user is the customerId from the logged in admin's JWT
    // The variable creates simplicity
  var customerId = req.user.app_metadata.customerId;

  // Using the users module with the get function, retrieve all users under the same customerId
  users.get(customerId)
  .then((users)=>{
    // Send all company users to the browser
    res.json(users);
  })
  .catch(function (error) {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });
});
// End of Get All Users


// Get Single User
app.get('/api/users/:userId', function(req, res){
  /*This endpoint retrieves the information of a single user with the userId parameter*/

  // Extract the userId value from the parameter.
    //The userId is an auth0 userId, this will retrieve all the data auth0 has on this user
    //Stripe information, like subscription, is stored in auth0 database
  users.getUser(req.params.userId)
  .then(user => {
    // Send the user information to the browser
    res.json(user);
  })
  .catch(error => {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });
});
// End of Get Single User


// Post/Create User
app.post('/api/users', function(req, res) {
  /*This endpoint creates a new user/employee, admins are only created on signup*/

  // Set req.user and req.body values as variables for simplicity
    // The customerId is used to identify the company
    // Each new employee will be associated with the current admin's company
  var customerId = req.user.app_metadata.customerId;
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  // Use the users module with the createUser function to send requests to auth0 and stripe to create a new user/employee
  users.createUser(customerId, email, password, firstName, lastName)
  .then(updatedSub =>{
    // Send the new user information to the browser
    res.json(updatedSub);
  })
  .catch(function (error) {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });

});
// End of Post/Create User


// Patch/Update User Information
app.patch('/api/users/:userId', function(req, res) {
  /*This endpoint updates user information with a patch request and a userId parameter*/

  // Set the req.params and req.body to variables for simplicity
    // The userData is already formatted for the requests with the correct keys, this is done in the browser before sending the patch
    // The userData may include a password, firstName, lastName, or email key
  userId = req.params.userId;
  userData = req.body;

  // Use the users module with the update function to send a patch request to auth0
  users.update(userId, userData)
  .then( updatedUser =>{
    // Send the updatedUser information to the browser
    res.json(updatedUser);
  })
  .catch(function (error) {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });
  
});
//End of Patch/Update User Information


// Delete User
app.delete('/api/users/:userId', function(req, res) {
  /*
  This endpoint deletes a user/employee from a company. Admins cannot be deleted
  */

  // Set the req.user value to a variable for simplicity
    // This is used to identify to which company the user belongs 
  var customerId = req.user.app_metadata.customerId;

  // Use the users module with the deleteUser function to delete a user from auth0 and update the subscription quantity in stripe
  users.deleteUser(customerId, req.params.userId)
  .then( updatedSub =>{
    // Send the updated subscription data to the browser, this shows a quantity change
    res.json(updatedSub);
  })
  .catch(function (error) {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });
  
});
// End of Delete User


// Get Plans
app.get('/api/plans', function(req, res){
  /*
  This endpoint retrieves all of the available plans from the stripe database
  */

  // Use the plans module with the getAll function to retrieve the plans
  plans.getAll()
  .then(plans => {
    // Send the plans data to the browser
    res.json(plans);
  })
  .catch(error => {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  });
});
// End of Get Plans


// Get Current Plan
app.get('/api/currentplan', function(req, res) {
  /*
  This endpoint retrieves the current plan on which the logged in admin is registered
  */

  // Set the req.user value to a variable for simplicity
    // This is used to identify the company on stripe
  var customerId = req.user.app_metadata.customerId;

  // Use the plans module with the getCurrent function to retrieve the current plan
  plans.getCurrent(customerId)
  .then(currentPlan => {
    // Send current plan data to the browser
    res.json(currentPlan);
  })
  .catch(error => {
    res.status(500).json({status: 500, message: "ERROR", sub: error, });
  })
});
// End of Get Current Plan


// Put/Update Current Plan
app.put('/api/currentplan', function(req, res) {
  /*
  This endpoint updates the user's current plan to another plan
  */

  // Set the req.user and req.body values to variables for simplicity
  var customerId = req.user.app_metadata.customerId;
  var planToUpdate = req.body.planToUpdate;

  // Use the plans module with the updateCurrent function to update the current plan to the desired plan
  plans.updateCurrent(customerId, planToUpdate)
    .then(updatedPlan => {
      // Send the updated plan data to the browser
      res.json(updatedPlan);
    })
    .catch(error => {
      res.status(500).json({status: 500, message: "ERROR", sub: error, });
    });
});
// End of Put/Update Current Plan


// Get Charges
app.get('/api/charges', function(req, res){
  /*
  This endpoint will retreive the charges, billing history, of a company from stripe
  */
  res.send('TODO');
});
// End of Get Charges


// Get Creditcard Info
app.get('/api/creditcard', function(req, res) {
  /*
  This endpoint retrieves the current creditcard information for the admin user/registered company on stripe
  */
  var customerId = req.user.app_metadata.customerId;

  //Use the creditCard module with the get function to retreive creditcard data
  creditCard.get(customerId)
    .then(creditCard => {
      //If the creditCard is undefined, if the client does not currently have a creditcard on file
        // Then send an object with doesNotExist as true to the browser
        // This tells the browser that the user does not currently have a creditcard
      if(!creditCard){
        res.json({doesNotExist: true});
      }
      // Else, the user has a registered card
        // Send this data to the browser
      else {
        res.json(creditCard);
      }
    })
    .catch(error => {
      res.status(500).json({status: 500, message: "ERROR", sub: error, });
    });
});
// End of Get Creditcard Info


// Post/Create/Update Creditcard
app.post('/api/creditcard', function(req, res) {
  /*
  This endpoint creates/updates a creditcard for the admin user.
    Stripe cannot update a creditcard number, the API requires a new card to be made in order to replace the existing card's place
    Thus, both create and update use a post request
  */

  // Set req.user and req.body values to variables for simplicity
  var customerId = req.user.app_metadata.customerId;
  var creditCardData = req.body;

  // Use the creditCard module with the get function to retreive the creditcard information from stripe
  creditCard.get(customerId)
    .then(creditCardIsThere => {
      //If card is undefined, a card does not exist, then create a creditcard
      if(creditCardIsThere === undefined){
        return creditCard.create(customerId, creditCardData)
      }
      // Else, update the registered creditcard with the new information
      else {
        return creditCard.update(customerId, creditCardData)
      }
    })
    .then(finalCreditCardData => {
      //Send creditcard data to the browser, either the newly created or updated card
      res.json(finalCreditCardData);
    })
    .catch(error => {
      res.status(500).json({status: 500, message: "ERROR", sub: error, });
    });
});
// End of Post/Create/Update Creditcard


// Our listen middleware
  // If a port is specified in the .env file, use that otherwise use localhost:1337
  // We are Elite
app.listen(process.env.PORT || 1337, function() {
  console.log('Server started');
});
