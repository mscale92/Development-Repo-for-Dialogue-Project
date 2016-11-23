var ManagementClient = require('auth0').ManagementClient;
var stripe = require('stripe')(process.env.STRIPE_SK_TEST);
var auth0 = new ManagementClient({
  token: process.env.AUTH0_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
});

var auth0Connection = "Username-Password-Authentication";


module.exports = {
  // get all users in a company
	get: function (customerId){
    // q is used for auth0 search queries
      // This query returns all the users who have the same customerId which represents their company
		return auth0.getUsers({q: `app_metadata.customerId: "${customerId}"`});

	},
  //get a single user
  getUser: function(userId){
    return auth0.getUsers({id: userId});
  },
  //edit/update a single user
  update: function(userId, userData){
    return auth0.updateUser({id: userId}, userData);
  },
  //delete a single user
	deleteUser: function(customerId, userId){
		return auth0.deleteUser({id: userId})
  		.then(function(response){  
        // If auth0 sends back an error, throw an error, do not edit stripe information
        if(response.status && response.status !== 200){
          // throw consistent error message
          throw new Error(response);
        }
        else{
  		    return stripe.customers.retrieve(customerId);
        }
  		})
  		.then(function(customer) {
        // Retrieve quantity amount from stripe subscriptions for that customer
      	var subscriptionId = customer.subscriptions.data[0].id;
      	return stripe.subscriptions.retrieve(subscriptionId)
      })
      .then(function(subscription){
        // Edit the quantity amount by subtracting one from the previous amount
      	var quantity = subscription.quantity;
      	var subscriptionId = subscription.id;
        return stripe.subscriptions.update(subscriptionId, {
  	         quantity: (quantity-1)
  	    });
    	});
	},
  // creates a user for the company
	createUser: function(customerId, email, password, firstName, lastName){
    // first send a post to auth0 to create a new user with appropriate fields
		return auth0.createUser({
  			connection: auth0Connection,
  			email: email,
  			password: password,
  			user_metadata: {
  				firstName: firstName,
  				lastName: lastName,
  			},
  			app_metadata: {
  				customerId: customerId,
  				roles: ["employee"],
  			},
  		})
  		.then(function(result){
        // If auth0 sends back an error, throw an error, do not edit stripe information
        if(result.status && result.status !== 200){
          // throw consistent error message
          throw new Error(result);
        }
        else{
          // if all goes well with auth0, move to stripe
          return stripe.customers.retrieve(customerId);
        }

        // return stripe.customers.retrieve(customerId);
  		})
  		.then(function(customer) {
        // grab the subscription id since the quantity will need to be updated
      	var subscriptionId = customer.subscriptions.data[0].id;
      	return stripe.subscriptions.retrieve(subscriptionId)
      })
      .then(function(subscription){
        // add one to the previous subscription quantity to show that a new user has been successfully added
      	var quantity = subscription.quantity;
      	var subscriptionId = subscription.id;
        return stripe.subscriptions.update(subscriptionId, {
		    quantity: quantity+1
		    })
      })

	}
}
