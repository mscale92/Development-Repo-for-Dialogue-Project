var stripe = require('stripe')(process.env.STRIPE_SK_TEST);
var ManagementClient = require('auth0').ManagementClient;

var auth0 = new ManagementClient({
  token: process.env.AUTH0_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
});





module.exports = {
	update: function patchCompany(customerId, userId, companyName){

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

	get: function getCompany(customerId){
		return stripe.customers.retrieve(customerId)
		.then(customer => {
		    return {
		      customerId: customer.id,
		      companyName: customer.description,
		      subscription: customer.subscriptions,
		     };
	 	});
	  
	}

};

 // 1. Extract the customerId from the req.user
 //  2. Make a call to Stripe to UPDATE this customer's description by ID, using the info from req.body
 //  3. Update company name in Auth0
 //  4. Send back a JSON response with {"name": "new name of the company", and any other useful info}