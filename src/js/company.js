var stripe = require('stripe')(process.env.STRIPE_SK_TEST);
var ManagementClient = require('auth0').ManagementClient;

// Use the auth0 variable to make Management requests
var auth0 = new ManagementClient({
  token: process.env.AUTH0_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
});

// Export the module as an object of functions
module.exports = {
	// The get function retrieves company information; name, customerId, and subscription 
  	get: function(customerId){
	    return stripe.customers.retrieve(customerId)
	    .then(customer => {
	        return {
	          customerId: customer.id,
	          companyName: customer.description,
	          subscription: customer.subscriptions,
	         };
	    });
  },
  	// The update function updates the company name, first on stripe then on auth0
	update: function(customerId, userId, companyName){
		return stripe.customers.update(customerId,
			{description: companyName}
		)
		.then(function(result){
			console.log("stripe ok!");
			return auth0.updateUser({id: userId}, {app_metadata: {companyName: companyName}});
		})
		.then(function(result){
			console.log("auth0 ok!");
			return result;
		});

	},
};