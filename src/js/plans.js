var stripe = require('stripe')(process.env.STRIPE_SK_TEST);

// Export the module as an object of functions
module.exports = {
  // The getAll function retreives all of the plans currently available on stripe
  getAll: function(){
    return stripe.plans.list();
  },
  // The getCurrent function retreives the current plan on which the admin user is registered
  getCurrent: function(customerId){
    return stripe.customers.retrieve(customerId)
      .then(customer => {
        return(
          {
            plan: customer.subscriptions.data[0].plan,
            subscriptionQuantity: customer.subscriptions.data[0].quantity,
          }
        );
      });
  },
  // The updateCurrent function updates the admin user's plan to a different plan, the new plan is the newPlanId
  updateCurrent: function(customerId, newPlanId){
    return stripe.customers.retrieve(customerId)
      .then(customer => {
        var subscriptionId = customer.subscriptions.data[0].id;
        var subscriptionQuantity = customer.subscriptions.data[0].quantity;
        return stripe.subscriptions.update(subscriptionId, {
          plan: newPlanId,
          quantity: subscriptionQuantity
        });
      })
      .then(subscription => {
        return subscription;
      });
  }
};
