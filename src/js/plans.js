var stripe = require('stripe')(process.env.STRIPE_SK_TEST);

module.exports = {
  //Returns the customer's current plan data, as well as the quantity suscribed as JSON
  getAllPlans: function(){
    return stripe.plans.list();
  },

  getCurrentPlan: function(customerId){
    return stripe.customers.retrieve(customerId)
      .then(customer => {
        return(
          {
            plan: customer.subscriptions.data[0].plan,
            subscriptionQuantity: customer.subscriptions.data[0].quantity,
          }
        )
      });
  },
  //Updates the customer's current plan, returns the new subscription as JSON
  updateCurrentPlan: function(customerId, newPlanId){
    return stripe.customers.retrieve(customerId)
      .then(customer => {
        var subscriptionId = customer.subscriptions.data[0].id;
        return stripe.subscriptions.update(subscriptionId, {plan: newPlanId});
      })
      .then(subscription => {
        return subscription;
      })
  }
}
