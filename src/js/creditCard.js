var stripe = require('stripe')(process.env.STRIPE_SK_TEST);

module.exports = {
  getCreditCard: function(customerId){
    return stripe.customers.retrieve(customerId)
      .then(customer =>{
        return customer.sources.data[0]
      });
  },
  updateCreditCard: function(customerId, updatedCreditCardData){
    getCreditCard(customerId)
      .then(creditCardData => {
        var creditCardId =
        return stripe.customers.updateCard(customerId, creditCardId, {updatedCreditCardData})
      })
      .then(newCreditCardData => {
        return newCreditCardData;
      })
  },
  createCreditCard: function(customerId, newCreditCard){
    stripe.tokens.create(newCreditCard, customerId)
      .then(newCreditCardData => {
        return newCreditCardData;
      });
  },
}
