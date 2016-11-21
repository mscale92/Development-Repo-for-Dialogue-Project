//Screen for Plans

import React from 'react';
import {List, ListItem} from 'material-ui/List';
import {Card, CardTitle, CardText} from 'material-ui/Card';

var BillingPage = React.createClass({
  render() {
    return (
    	<div>
    		<h2>Billing</h2>
	    		<Card>
	    			<CardTitle title="General Info" />
	    			<List>
	    				<ListItem primaryText="Company Name: XXX"/>
	    				<ListItem primaryText="Company Address: XXX"/>
	    				<ListItem primaryText="Registered Card: XXX"/>
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
