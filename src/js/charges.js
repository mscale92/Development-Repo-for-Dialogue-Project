var stripe = require('stripe')(process.env.STRIPE_SK_TEST);

// Export the module as an object of functions
module.exports = {
  // The getAll function retreives all charges from the admin user, this is the billing history
  getAll: function(customerId){
    return stripe.charges.list({customer: customerId});
  },
}
