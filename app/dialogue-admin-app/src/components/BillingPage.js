//Screen for Plans

import React from 'react';
import {List, ListItem} from 'material-ui/List';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import {browserHistory} from 'react-router';


const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    height: '100vh',
    marginTop: '30vh'
}

var BillingPage = React.createClass({
  getInitialState: function(){
    return {};
  },
  _getCurrentCreditCard: function(){
    return fetch('http://localhost:1337/api/creditcard', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + localStorage.token}
    })
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      else {
        return response.json();
      }
    });
  },
  componentDidMount: function(){
    var that = this
    this._getCurrentCreditCard()
    .then(currentCreditCard => {
      that.setState({creditCard: currentCreditCard});
    });
  },
  render() {

    if(!this.state.creditCard){
      return (
        <div style={style}>
          <CircularProgress/>
        </div>
      )
    }

    if(this.state.creditCard.doesNotExist){
      return (
        <div>
          <h2>Billing</h2>
            <Card>
              <CardTitle title="General Info" />
              <List>
                <ListItem primaryText="No registered credit card, click here to register a card" onClick={() => browserHistory.push('/editcard')}/>
              </List>
            </Card>
            <Card>
              <CardTitle title="Billing History" />
              <CardText></CardText>
            </Card>
        </div>
      )
    }
    return (
    	<div>
    		<h2>Billing</h2>
	    		<Card>
	    			<CardTitle title="General Info" />
	    			<List>
	    				<ListItem primaryText="Registered credit card"/>
              <List>
                <ListItem primaryText={"Number: **** **** **** " + this.state.creditCard.last4}/>
                <ListItem primaryText={"Expiration Date: " + this.state.creditCard.exp_month + "/" + this.state.creditCard.exp_year}/>
                <ListItem primaryText={"Type: " + this.state.creditCard.brand}/>
                <ListItem primaryText={"Country: " + this.state.creditCard.country}/>
              </List>
	    			</List>
	    		</Card>
	    		<Card>
	    			<CardTitle title="Billing History" />
				    <CardText></CardText>
	    		</Card>
	    </div>
    );
  }
});

export default BillingPage;
