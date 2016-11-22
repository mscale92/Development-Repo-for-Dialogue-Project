# Dialogue Management API

## Stripe 101

With this guide, you'll be able to:
- Require stripe with your secret key
- Create a customer
- Get a credit card token
    - Through a form + functions
    - Through ```stripe.tokens.create```
- Assign a credit card to a customer
- Create plans
    - A payed plan
    - A payed plan with a free trial period
    - A free plan
- Create a subscription
    - With a credit card
    - Without a credit card
- Update customers, plans, subscriptions
- Retrieve customers, plans, subscriptions by ID

### Link to Stripe API

[Stripe API](https://stripe.com/docs/api)

### Require stripe with your secret key

```javascript
var stripe = require("stripe")("sk_test_12345676BnY1Tbw3xNRzRyYL"); //This is a testing key, it's not valid, get your own!
```
### Create a customer

You'll need a customer object to pass to ```stripe.customers.create```.

Find the possible inputs here:

```javascript
stripe.customers.create({
  description: "It's me Mario",
  email: "mario@nintendo.com",
})
.then(customer => {
  console.log(customer);
})
.catch(error => {
  console.log("Error", error);
})
```
If all goes well, you'll get back a customer object that has a unique customer ID, you'll need it for subscriptions.

### Get a credit card token

The customer will have to input their information in a credit card form. The basic required fields are:
*Card Number*, *Expiry date with format MM/YY*, *CVC*.

##### HTML code
You'll have to modify it slightly to use it in a React .jsx component.

```HTML
<form action="/your-charge-code" method="POST" id="payment-form">
  <span class="payment-errors"></span>

  <div class="form-row">
    <label>
      <span>Card Number</span>
      <input type="text" size="20" data-stripe="number">
    </label>
  </div>

  <div class="form-row">
    <label>
      <span>Expiration (MM/YY)</span>
      <input type="text" size="2" data-stripe="exp_month">
    </label>
    <span> / </span>
    <input type="text" size="2" data-stripe="exp_year">
  </div>

  <div class="form-row">
    <label>
      <span>CVC</span>
      <input type="text" size="4" data-stripe="cvc">
    </label>
  </div>


  <input type="submit" class="submit" value="Submit Payment">
</form>
```

See and test the form here: https://stripe.com/docs/custom-form

If the credit card information is valid, you'll get back a ```token``` of the form ```tok_69NxYuGdFb1fc8Dc2qsG7vIE```.

### Get a credit card token in back-end

```javascript
stripe.tokens.create({
  card: {
    "number": '4242424242424242',
    "exp_month": 12,
    "exp_year": 2017,
    "cvc": '123'
  })
.then(token => {
  console.log(token);
})
.catch(error => {
  console.log("Error", error);
});
 ```

### Assign a credit card to a customer

You must pass a customer ID and a credit card token ```source``` to ```stripe.customers.createSource```.

```javascript
stripe.customers.createSource(
  "cus_6VgECdI0hbS3Sd", //Customer's unique ID
  {source: "tok_69NxYuGdFb1fc8Dc2qsG7vIE"} //Credit card token
)
.then(card => {
  console.log(card);
})
.catch(error => {
  console.log("Error", error);
})
```

### Create plans
You'll need a plan object to pass to ```stripe.plans.create```.
###### The following will create a paying plan.

```javascript
stripe.plans.create({
  amount: 1500, //in cents
  interval: "month", //can be day, week, month, year
  name: "gold plan",
  currency: "cad", //ISO code
  id: "gold"
})
.then(plan => {
  console.log(plan);
})
.catch(error => {
  console.log("Error", error);
})
```

If all goes well, you'll get back a plan object that has a unique plan ID, which you defined, in the previous case for example as ```gold```. You'll need it for subscriptions.

###### The following will create a paying plan with a free trial period in days.

Customers can subscribe to a paying plan with a free trial without a credit card! They'll need one once it ends though.

```javascript
stripe.plans.create({
  amount: 1000,
  name: "free trial plan",
  interval: "month",
  currency: "cad",
  id: "free",
  trial_period_days: 10 //Add the trial_period_days
})
.then(plan => {
  console.log(plan);
})
.catch(error => {
  console.log("Error", error);
})
```

###### The following will create a free plan.

Customers can suscribe to a free plan without a credit card!

```javascript
stripe.plans.create({
  amount: 0, //No money, no problem
  name: "Zero plan",
  interval: "month",
  currency: "cad",
  id: "zero"
})
.then(plan => {
  console.log(plan);
})
.catch(error => {
  console.log("Error", error);
})
```
### Create a subscription

To create a subscription you will assign a customer to a plan by passing a subscription object to ```stripe.subscriptions.create```.

```javascript
stripe.subscriptions.create({
  customer: "cus_3ZPM52RITnTRPA", //Customer ID, which you get back when you create a customer
  plan: "gold", //Plan ID
})
.then(function(subscription){
  console.log(subscription);
})
.catch(function(error){
  console.log("Error", error);
})
```
Since ```gold``` is a paying plan without a free trial, the customer will need a credit card registered with their account.

You can also add a ```quantity``` to the subscription object, it will multiply the cost by a factor of ```quantity```.

```javascript
stripe.subscriptions.create({
  customer: "cus_3ZPM52RITnTRPA",
  plan: "gold",
  quantity: 5 //Quantity of plans to suscribe to the customer
})
.then(function(subscription){
  console.log(subscription);
})
.catch(function(error){
  console.log("Error", error);
})
```

### Update customers, plans, subscriptions
- Update customer
```javascript
stripe.customers.update("cus_3Zg3Tv22dCS8S5", {
  description: "Customer for elizabeth.johnson@example.com" //New/Updated metadata
})
.then(customer =>
    console.log(customer))
.catch(error =>
    console.log(error));
```
- Update plan
```javascript
stripe.plans.update("gold", {   //plan ID
  name: "Gold plus" //New/Updated metadata
})
.then(plan =>
    console.log(plan))
.catch(error =>
    console.log(error));
```
- Update Subscription
```javascript
stripe.subscriptions.update(
  "sub_1ZflvANV3kM2Ap",
  { plan: "zero" //New/Updated metadata
  })
  .then(subscription =>
    console.log(subscription))
.catch(error =>
    console.log(error));
```


### Retrieve customers, plans subscriptions

##### Retrieve customer object

```javascript
stripe.customers.retrieve(
  "cus_3Zg3Tv22dCS8S5" //Customer ID
 )
.then(customer =>
    console.log(customer))
.catch(error =>
    console.log(error));
```
##### Ouput

For customer

```javascript
{
  "id": "cus_9AgaSgI1hb24Sd", //Customer ID
  "object": "customer",
  "account_balance": 0,
  "created": 1479315995,
  "currency": "cad",
  "default_source": "card_19FxYuMqPb0fc4E5qcpogEZ", //Card registered with customer
  "delinquent": false,
  "description": "It's me Mario",
  "discount": null,
  "email": "mario@nintendo.com",
  "livemode": false,
  "metadata": {
  },
  "shipping": null,
  "sources": {
    "object": "list",
    "data": [   //Credit card data
      {
        "id": "card_19FxYuMqPb0fc4E5qcpogEZ", //Card ID
        "object": "card",
        "address_city": null,
        "address_country": null,
        "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,
        "address_state": null,
        "address_zip": null,
        "address_zip_check": null,
        "brand": "Visa",
        "country": "US",
        "customer": "cus_9ZgEMgI0hbS9Sd",
        "cvc_check": null,
        "dynamic_last4": null,
        "exp_month": 8,
        "exp_year": 2017,
        "funding": "credit",
        "last4": "4242", //Last 4 digits of credit card
        "metadata": {
        },
        "name": null,
        "tokenization_method": null
      }
    ],
    "has_more": false,
    "total_count": 1,
    "url": "/v1/customers/cus_9ZgEMgI0hbS9Sd/sources"
  },
  "subscriptions": {
    "object": "list",
    "data": [
      {
        "id": "sub_9a2HIlcCP7mtzt",
        "object": "subscription",
        "application_fee_percent": null,
        "cancel_at_period_end": false,
        "canceled_at": null,
        "created": 1479398001,
        "current_period_end": 1481990001,
        "current_period_start": 1479398001,
        "customer": "cus_9ZgEMgI0hbS9Sd",
        "discount": null,
        "ended_at": null,
        "livemode": false,
        "metadata": {
        },
        "plan": {
          "id": "gold", //Customer subscribed to gold plan
          "object": "plan",
          "amount": 1500,
          "created": 1479248605,
          "currency": "cad",
          "interval": "month",
          "interval_count": 1,
          "livemode": false,
          "metadata": {
          },
          "name": "gold plan",
          "statement_descriptor": null,
          "trial_period_days": null
        },
        "quantity": 5, //Quantity of subscriptions to the gold plan
        "start": 1479398060,
        "status": "active",
        "tax_percent": null,
        "trial_end": null,
        "trial_start": null
      }
    ],
    "has_more": false,
    "total_count": 1,
    "url": "/v1/customers/cus_9ZgEMgI0hbS9Sd/subscriptions"
  }
}
```


##### Retrieve plan object
```javascript
stripe.plans.retrieve(
  "gold" //Plan ID
 )
.then(plan =>
    console.log(plan))
.catch(error =>
    console.log(error));
```


##### Retrieve subscription object
```javascript
stripe.subscriptions.retrieve(
  "sub_1ZflvANV3kM2Ap" //Subscription ID
 )
.then(subscription =>
    console.log(subscription))
.catch(error =>
    console.log(error));
```

### List customers, plans, subscriptions

##### Customers

```javascript
stripe.customers.list(
  { limit: 3 } ///Optional, default is 10, can be between 1 and 100
)
.then(customers =>
    console.log(customers))
.catch(error =>
    console.log(error));
```

###### Output

An array of customers as property ```data```.

```javascript
{
  "object": "list",
  "url": "/v1/customers",
  "has_more": false,
  "data": [
    {
      "id": "cus_9ZgEMgI0hbS9Sd",
      "object": "customer",
      "account_balance": 0,
      "created": 1479315995,
      "currency": "cad",
      "default_source": "card_19FxYuGdFb0fc8GBHVcpogEZ",
      "delinquent": false,
      "description": "It's me Mario",
      "discount": null,
      "email": "mario@nintendo.com",
      "livemode": false,
      "metadata": {
      },
      "shipping": null,
      "sources": {
        "object": "list",
        "data": [
          {
            "id": "card_19FxYuGdFb0fc8GBHVcpogEZ",
            "object": "card",
            "address_city": null,
            "address_country": null,
            "address_line1": null,
            "address_line1_check": null,
            "address_line2": null,
            "address_state": null,
            "address_zip": null,
            "address_zip_check": null,
            "brand": "Visa",
            "country": "US",
            "customer": "cus_9ZgEMgI0hbS9Sd",
            "cvc_check": null,
            "dynamic_last4": null,
            "exp_month": 8,
            "exp_year": 2017,
            "funding": "credit",
            "last4": "4242",
            "metadata": {
            },
            "name": null,
            "tokenization_method": null
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/customers/cus_9ZgEMgI0hbS9Sd/sources"
      },
      "subscriptions": {
        "object": "list",
        "data": [
          {
            "id": "sub_9a2HIlcCP7mtzt",
            "object": "subscription",
            "application_fee_percent": null,
            "cancel_at_period_end": false,
            "canceled_at": null,
            "created": 1479398001,
            "current_period_end": 1481990001,
            "current_period_start": 1479398001,
            "customer": "cus_9ZgEMgI0hbS9Sd",
            "discount": null,
            "ended_at": null,
            "livemode": false,
            "metadata": {
            },
            "plan": {
              "id": "gold",
              "object": "plan",
              "amount": 1500,
              "created": 1479248605,
              "currency": "cad",
              "interval": "month",
              "interval_count": 1,
              "livemode": false,
              "metadata": {
              },
              "name": "gold plan",
              "statement_descriptor": null,
              "trial_period_days": null
            },
            "quantity": 5,
            "start": 1479398060,
            "status": "active",
            "tax_percent": null,
            "trial_end": null,
            "trial_start": null
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/customers/cus_9ZgEMgI0hbS9Sd/subscriptions"
      }
    },
    {...},
    {...}
  ]
}
```

###### Plans

Same as for customers, replace ```customers``` by ```plans``` in function.

##### subscriptions

Same as for customers, replace ```customers``` by ```subscriptions``` in function call.



##Auth0 Overview

Auth0 is a useful api for checking user authentication. In other words, it is useful for seeing if someone is logged in or not.

Here we're going to go over the basics for understanding the Auth0 apis, both management and authentication,
as well as the proper syntax for making requests, with and without the auth0 node js library

BUT FIRST!

Here is a key to the auth0 terminology:

      Client: The app, or company, using auth0.
          A client will have many users.

      User: Someone who has signed up on auth0.
          A group of users will belong to one client.

      Metadata: Optional data that can be added to a user's profile.
        In auth0 there are two types of metadata; user_metadata and app_metadata.

      id_token: A JWT that is returned whe a user successfully logs in.
        The scope of the api request must be an openid to receive the id_token in the body.

      JWT: JSON Web Token, this is an encrypted token that contains some information pertaining to its original source. When decrypted, the information is accessible to the receiver.

        In auth0, JWTs are used to authenticate whether or not the user is logged in. If logged in, they have access to the api.

        They expire daily, as a default, in auth0.

        With scopes, you can add metadata into the JWT so that upon decryption, the metadata is available to the receiver.

      API Token: The JWT that is used to access the client's api.

        This is generated from a successful request with the client secret, like a password, and client id, like a username. When someone is logged in, auth0 checks whether or not their id_token matches the api token.

        This code determines what the user can do to the api; read only, read/write, everything, you name it. Thus why it is sensitive information.

      Scopes: Scopes refer to the set capacity of the api or request.

        On auth0, you can make an api with a limited scope, say a read only api. This api's token will only allow its client's users to read information. They will not be able to modify it at all.

        When used in a request body, say logging in, scopes tell the api which data it wants returned in the JWT.  

Before you start making requests:

  1. Create an auth0 account
  2. Go to account settings, click the drop down under your username
  3. Click on the advanced tab
  4. Turn on "Enable APIs Section" and "OAuth 2.0 API Authorization"
  5. Go to the Users tab, located in the left-hand aside navigation
  6. Click the "Create User" button and make some mock users


Ready to go?

###Starting with the Users

User information is often what you will be accessing with auth0. So, let's start with requesting a list of users.

For this task, we will be using the Auth0 Management API v2, [https://auth0.com/docs/api/management/v2#!/Users/get_users](https://auth0.com/docs/api/management/v2#!/Users/get_users "test your endpoints")

  First, look at the left-hand side of the page an locate the token generator.
    This allows us to access our API

  Second, set the Scope of the token generator.
    This tells auth0 what kind of access we have to the API.  
    For now a simple, users:read, scope will do.

Here is auth0's tutorial, [https://auth0.com/docs/api/management/v2/tokens](https://auth0.com/docs/api/management/v2/tokens)

Alright, now that those basics are set, let's run the GET request. Simply click the TRY button to test the endpoint

If all goes well, a rendered list of user profiles will appear, and look something like this:

    `[
    {
      "email": "john.doe@gmail.com",
      "email_verified": false,
      "username": "johndoe",
      "phone_number": "+199999999999999",
      "phone_verified": false,
      "user_id": "usr_5457edea1b8f33391a000004",
      "created_at": "",
      "updated_at": "",
      "identities": [
        {
          "connection": "Initial-Connection",
          "user_id": "5457edea1b8f22891a000004",
          "provider": "auth0",
          "isSocial": false
        }
      ],
      "app_metadata": {},
      "user_metadata": {},
      "picture": "",
      "name": "",
      "nickname": "",
      "multifactor": [
        ""
      ],
      "last_ip": "",
      "last_login": "",
      "logins_count": 0,
      "blocked": false,
      "given_name": "",
      "family_name": ""
    }
  ]`

After you've successfully received a list of users from the API,

  if not, scroll down on the management api to see a list of errors and causes,

it's time to step up the game.

NOTE:

  If you are testing auth0 locally, you will need to update your API Token daily, it expires. To do so:

    1. Go to the auth0 dashboard
    2. Click on API
    3. Click on Auth0 Management API, or your own custom API
    4. Click on Test
    5. Scroll down to response
    6. Copy your updated API Token from the response

#####Let's grab only a certain set of users.

Say that three of your users belong to the same company. This information would be stored in the app_metadata as, `app_metadata: {company: "name of the company"}`. If your users don't have any app_metadata, just make some new ones on your dashboard, we'll touch on creating and patching users with the API later on.

So, how do we request users that are all from the same company?
Q or q to be exact.

  q stands for query, in lucene syntax
  It sorts your users, without drawbacks.

Auth0 users the q key with a value, a string, to sort its get users requests. The q key goes in the parameters, params if using postman, and is set equal to its value. The value is always written in Lucene Query Syntax

  NOTE:
  When using auth0's node js library, you must have the string value between single quotes.
  This is because the query string only recognizes substrings between double quotes. On occassion, like for a company name, you will need to run a query with a substring.

  Example
    `{q:'app_metadata.company:"Mushroom Inc"'}`


####How is the query formatted?

The the query must always be preceded by q before the string can start, this is mandatory.
In order to string multiple conditions together, use AND within the query string. This is following Lucene syntax

For example:

On Postman:

    GET('https://USERNAME.auth0.com/api/v2/users?q=app_metadata.company:"Mushroom Inc" AND app_metadata.roles:"admin"')

With request (as a callback):

    var options = { method: 'GET',
      url: 'https://USERNAME.auth0.com/api/v2/users/user_id',
      headers:
       { 'content-type': 'application/json',
         authorization: 'Bearer API_TOKEN' },
     q: 'app_metadata.company:"Mushroom Inc" AND app_metadata.roles:"admin"',
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });

    //For promise format simply make a new Promise with request

With auth0 node js library (as a promise):

    var ManagementClient = require('auth0').ManagementClient;

    var auth0 = new ManagementClient({
      token: '{YOUR_API_V2_TOKEN}',
      domain: '{YOUR_ACCOUNT}.auth0.com'
    });

       auth0
      .getUsers({q: 'app_metadata.company:"Mushroom Inc" AND app_metadata.roles:"admin"'})
      .then(function (users) {
        console.log(users);
      })
      .catch(function (err) {
        // Handle error.
        console.log(err);
      });


####Important NOTE!

  On Postman, and when using the request module, you must provide your authorization token, the JWT, in the header of the request.
  It will look something like this:

  `{authorization: bearer API_TOKEN}`

  Bearer labels tells the browser the type of token that is being sent, make sure to include it with the token.


There are many queries that can be used to retrieve users. Check out the links below to see a list of the queries on auth0 and to become more familiar with Lucene Query Syntax.

Here is auth0's documentation for user searches with queries [https://auth0.com/docs/api/management/v2/user-search](https://auth0.com/docs/api/management/v2/user-search) and Lucene Query Syntax [http://www.lucenetutorial.com/lucene-query-syntax.html](http://www.lucenetutorial.com/lucene-query-syntax.html)




###A brief bit about the Authentication API

Now, auth0 does have an authentication API that can be accessed from the server. This is useful when a client wants a general api token to be applied in their application.

Say for instance they want every visitor to be able to view user profiles whether or not they are logged in.

Well, in auth0's api tab, you can make an api that has restricted scopes, say read only.

On that particular page they can run a request to the auth0 authentication api for the token of the read only api. Then, they can use that token in their get request to display all the profiles.

This way anyone accessing the website only has limited api access. It is great a security measure against malicious visitors.

If visitors must be logged in to view pages that send api requests, the authentication API will be used to send requests to the server to login in a user and return a JWT token.

Bring on the JWT!


###Using JWT Middleware as Authentication

By now you're a pro at making requests to auth0. Test different request on their Api Management v2 or on the Postman application.

Just a reminder:

  PATCH updates a part of some data
  PUT updates the data entirely

It's time to look more closely at those lovely JWTs that auth0 uses.

  A JWT is made of three parts; a header, a payload, and a signature.

    The header holds the hashing algorithm value as well as the token type

    The payload holds the data that is passed between the sender and receiver
      This is where a username and app_metadata will be stored

    The signature verifies whether or not the person sending the request is allowed to access the api.
      This is where the secret is held

  All three parts are separated by a period in the JWT

If you have never heard of a JWT or want a more in depth explanation, please visit this link to their website for a very informative tutorial video and article, [https://jwt.io/introduction/](https://jwt.io/introduction/)

Auth0 provides JWT middleware in its lock widget, but for those who want a more custom experience on node js they will need to install the npm module jwt-express
  `var jwt = require('express-jwt');`
In the instructional video they also generate their own token with another jwt module, this is not necessary when using auth0 since they generate your jwt for you as your API_Token or id_token, whichever you need.

####Wait, what's the difference between the two tokens?

Well, both give you access to the api, but the id_token has some extra information in it.

  The id_token is unique to each user due to its payload.

  When a user logins with auth0, any information specified with the scope will be passed on within the payload.

So, how do we use these tokens to make sure that a user is logged in?

We will be using express middleware to check for authentication with JWTs.

NOTE:

In this example we are using request, it can be easily converted to auth0's module as well. This will be shown later.

Have these modules loaded into your server file, request is replaced with auth0 if using auth0's node js library.

`var request = require("request");`

`var express = require('express');`

`var bodyParser = require('body-parser');`

`var jwt = require('express-jwt');`

`var app = express();`

` var dotenv = require('dotenv');`


The dotenv module is used to load env, environment, files into your code
This is where sensitive information is stored, like your client secret.

NOTE:

You can find your client secret as well as your client id and domain in auth0's dashboard under the Clients tab.

Here is our JWT middleware!

`app.use(jwt({ secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'), audience: process.env.AUTH0_CLIENT_ID}).unless({path: ['/']}));`

Whoa, that's quite the line of code all at once, let's break down what's going on:

  1. app refers to express, this is how it is commonly called
  2. use is the middleware method in express, this means that it will run consistently throughout our program
  3. jwt refers to the jwt-express module. This is where the magic happens, by magic I mean a jwt is created with our client secret and client id. This signature will be tested against every request to our server. A user must have an id_token whose signature matches.
  4. The unless path

 JWT allows us to make exception routes, pages that don't need authentication
 just put .unless({path: ['/pathname']}) after the closing ) on jwt this will be attached as middleware rather than a variable of middleware with express-jwt

In the end, this is what the middleware will look like, complete with a an error handling callback function.

`app.use( jwt({ secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'), audience: process.env.AUTH0_CLIENT_ID}).unless({path: ['/']}), function(error, req, res, next){`
  `// an error handling callback`
  `if(error){`
    `console.log(error, "not logged in!");`
    `res.send("401 You are not authorized!");`
  `}`
`});`

You can test out this middleware by making a few mock paths, like '/' and '/users', with get requests on your server. Then use postman, in order to avoid having to render pages, to see if the JWT authentication works.

The JWT instructional video shows postman being used to test the JWT middleware.


###Auth0 Node Js Library Syntax!

This is not something the internet has large resource on. Unfortunately, the auth0 website uses request callbacks in most of its examples making the auth0 library syntax hard to come by.

When referring to the auth0 node js library module, it will be shortened to just auth0 for this section of the README.

We also will be demonstrating auth0 as promise functions for the majority of the tutorial.

There is a github repo [https://github.com/auth0/node-auth0](https://github.com/auth0/node-auth0) and a single page on their website [https://auth0.com/docs/libraries/auth0js](https://auth0.com/docs/libraries/auth0js) that briefly go over some parts of the library. Still, it is mostly trial and error in the beginning.

Luckily, I've done most of that for you dear programmer. Less trial and hopefully less error for you.

####Setting up auth0 module

Since we are already checking our authentication with JWT middleware, we only will be using the management API with auth0.
Set this at the head of your server document after installing the module.

  var ManagementClient = require('auth0').ManagementClient;

  var auth0 = new ManagementClient({
    token: process.env.AUTH0_TOKEN,
    domain: process.env.AUTH0_DOMAIN
  });

You must have your token and domain information stored in an .env file to insert the information into the new ManagementClient constructor.

You can insert this information manually but for security reasons it is recommended to keep all sensitive information in an .env file during development.

Once all of that is setup, you are ready to start making calls to auth0's api with auth0.

Setup a basic get request, or post, it doesn't matter, in your server.

  app.post('/api/signup', function(req, res){

  });

Then, insert an auth0 request inside of your server request.

  app.post('/api/signup', function(req, res){
    auth0
    .getUsers()
    .then(function (users) {
      console.log(users);
    })
    .catch(function (err) {
      // Handle error.
      console.log(err);
    });
  });

This request will grab all the users in your client's api. To use queries, or look up a specific profile id, with auth0, insert an object in the promise's parameters.

  app.post('/api/signup', function(req, res){
    var email = '"someone@example.com"';
    auth0
    .getUsers({q: 'email:' + email})
    .then(function (users) {
      console.log(users);
    })
    .catch(function (err) {
      // Handle error.
      console.log(err);
    });
  });

This request looks up a user by email address. If the address is found, the user profile will be returned. If the address is not found, an empty array will be returned.

  Remember to use body-parser to extract usable data from your requests!

auth0 can also use callbacks to return data, though promises are preferable.

  auth0.getUsers(function (err, users) {
    if (err) {
      // handle error.
    }
    console.log(users);
  });


###How to log in and sign up user with auth0

Previously we were using the auth0 management api to return user profiles and search for specific users. Now we need a way to sign our users into auth0.

This is where the Authentication API comes into play!

Before we start, make sure that auth0 has this at the top of your server.js document:

`var AuthenticationClient = require('auth0').AuthenticationClient;`

`var authentication0 = new AuthenticationClient({ domain: '{YOUR_ACCOUNT}.auth0.com', clientId: '{OPTIONAL_CLIENT_ID}' });`

  Just as before, enter your account information and client id from your .env file. This is preferable to hard coding.

Oddly enough, when it comes to making a new user the Management API is used while logging in, or signing in, uses the Authentication API.

This is an important distinction since you will be calling on one or the other when sending your request.

Remember, here auth0 = Management API and authentication0 = Authentication API


Let's start with Signup!


####Signing Up a User

In order to sign up a user to auth0 you need to start by making the correct request.

Deep in the auth0 module files, actually just the src folder, lives the management and auth folders. Within these folders live the auth0 request functions!

In order to sign up, you need to call the auth0.createUser() function.

This function will take an object parameter that contains all the necessary information that auth0 needs to create a new user. The necessary keys, with example values, are listed below:

  - connection: "Username-Password-Authentication",
  - email: "princesspeach@nintendo.com",
  - password: "123456",

Optional keys are listed below:

  - user_metadata: {firstName: "Peach", lastName: "Toadstool"}
  - app_metadata: {roles: ["admin", "employee"], company: "Mushroom Inc", customerId: "123abc"}

User metadata is used to store information uniquely related to the user, such as their name or address.

App metadata is used to store shared information related to the user, like the role of an employee.

Many users can be an employee but most users won't have the same first name.

NOTE:

  The connection key must be present. This tells auth0 what kind of authentication it is receiving.

Putting it all together!

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


If all goes well, you should receive the profile of the new user that you just created.

Time to log them in!


####Logging in a User

Just like signing up a user was createUser, the login function for auth0 is unique; authentication0.oauth.signIn()

And similarly to the creatUser function, the signIn function takes required and optional parameters.

Required parameter keys, with value examples:

  - grant_type: "password",
  - connection: "Username-Password-Authentication",
  - username: "princesspeach@nintendo.com",
  - password: "123456",

grant-type tells auth0 the authentication is coming from the password

Optional parameter keys:

  -scope: "openid app_metadata"

The scope tells auth0 which data should be present in the JWT token


Putting it together!

  return authentication0.oauth.signIn({
      grant_type: "password",
      connection: auth0Connection,
      username: email,
      password: password,
      scope: "openid app_metadata",
    });

Now you can successfully log a user in with the auth0 Authorization API!
Depending on the scope you will receive an id_token, app_metadeta, etc.


####What is different about auth0 syntax and request?

The main difference is how auth0 makes its requests to the api. Rather than declaring which method will be used along with the url, auth0 has its own function calls that merge what you want from the api and what kind of request it is.

  Example:

  auth0.getUsers()
  .then(function(users){
    console.log(users)
  })

getUsers is a get request to the users section of the api. Request writes it as:

  method: 'GET',
  url: 'https://USERNAME.auth0.com/api/v2/users/user_id'

auth0 is actually using request behind the scenes and simplifying the request format.

However, in simplicity lies potential confusion.

The request format clearly lays out the path to the api in the url, the auth0 functions do not. When trying to make more complex requests, it takes trial and error to find the correct syntax with auth0.

If the doc builds correctly, you have all of your syntax. This does not always work, when it fails, trial and error.

In the end, it is all about preference.


###Conclusion

Thank you for reading the auth0 introduction tutorial. I hope that it enlightened your knowledge of the wonderful api that is auth0.

Remember to stay safe with JWTs and have fun in postman.

Good luck!

##To be continued...
