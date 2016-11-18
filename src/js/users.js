var ManagementClient = require('auth0').ManagementClient;
var stripe = require('stripe')(process.env.STRIPE_SK_TEST);
var auth0 = new ManagementClient({
  token: process.env.AUTH0_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
});



/*
1. Extract the customerId from the req.user
  2. Make a call to Auth0 management API to list all users where app_metadata:company = that customerID
  3. Send back a JSON response with an array of users [{"id": "xxx", firstName: "xx", lastName: "xx", emailAddress: "xx", and any other field you deem necessary}]
  */

module.exports = {
	getCompany: function (customerId){
		return auth0.getUsers({q: `app_metadata.customerId: "${customerId}"`})

	},
	deleteUser: function(customerId, userId){
		return auth0.deleteUser({id: userId})
		.then(function(){
		return stripe.customers.retrieve(customerId)
		})
		.then(function(customer) {
        	var subscriptionId = customer.subscriptions.data[0].id;
        	return stripe.subscriptions.retrieve(subscriptionId)	
        })
        .then(function(subscription){
        	var quantity = subscription.quantity;
        	var subscriptionId = subscription.id;
	        return stripe.subscriptions.update(subscriptionId, {
			  quantity: quantity-1
			})
      })
	}
}