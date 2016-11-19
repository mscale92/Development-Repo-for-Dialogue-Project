var stripe = require('stripe')(process.env.STRIPE_SK_TEST);

module.exports = {

  create: function(customerId, newCreditCard){
    return stripe.tokens.create({card: newCreditCard})
      .then(token => {
        return stripe.customers.createSource(customerId, {source: token.id});
      })
      .then(createdCreditCard => {
        return createdCreditCard;
      });
  },
  get: function(customerId){
    return stripe.customers.retrieve(customerId)
      .then(customer =>{
        return customer.sources.data[0];
      });
  },
  update: function(customerId, updatedCreditCardData){
    return stripe.tokens.create({card: updatedCreditCardData})
      .then(token => {
        return stripe.customers.update(customerId, {source: token.id});
      })
      .then(newCreditCardData => {       
        return newCreditCardData;
      })
  },
}
