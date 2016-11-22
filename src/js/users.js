var ManagementClient = require('auth0').ManagementClient;
var stripe = require('stripe')(process.env.STRIPE_SK_TEST);
var auth0 = new ManagementClient({
  token: process.env.AUTH0_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
});

var auth0Connection = "Username-Password-Authentication";


module.exports = {
	get: function (customerId){
		return auth0.getUsers({q: `app_metadata.customerId: "${customerId}"`})

	},
  getUser: function(userId){
    return auth0.getUsers({id: userId})
  },
  update: function(userId, userData){
    return auth0.updateUser({id: userId}, userData)
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
			         quantity: (quantity-1)
			    });
      	});
	},
	createUser: function(customerId, email, password, firstName, lastName){
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
  			return stripe.customers.retrieve(customerId);
  		})
  		.then(function(customer) {
        	var subscriptionId = customer.subscriptions.data[0].id;
        	return stripe.subscriptions.retrieve(subscriptionId)
        })
        .then(function(subscription){
        	var quantity = subscription.quantity;
        	var subscriptionId = subscription.id;
	        return stripe.subscriptions.update(subscriptionId, {
			  quantity: quantity+1
			})
      	})

	}
}
