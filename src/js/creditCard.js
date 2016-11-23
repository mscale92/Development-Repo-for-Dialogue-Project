var stripe = require('stripe')(process.env.STRIPE_SK_TEST);

// Export the module as an object of functions
module.exports = {
  // The create function creates a new credit card on stripe
  create: function(customerId, newCreditCard){
    return stripe.tokens.create({card: newCreditCard})
      .then(token => {
        return stripe.customers.createSource(customerId, {source: token.id});
      })
      .then(createdCreditCard => {
        return createdCreditCard;
      });
  },
  // The get function retreives credit card information on the current registered card
  get: function(customerId){
    return stripe.customers.retrieve(customerId)
      .then(customer =>{
        return customer.sources.data[0];
      });
  },
  //The update function updates a creditcard on stripe, this is done by creating a new credit card
  update: function(customerId, updatedCreditCardData){
    return stripe.tokens.create({card: updatedCreditCardData})
      .then(token => {
        return stripe.customers.update(customerId, {source: token.id});
      })
      .then(newCreditCardData => {       
        return newCreditCardData;
      });
  },
};
