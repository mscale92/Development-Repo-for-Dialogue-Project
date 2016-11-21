import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

//this is the main page the HR manager will see after logging in
//this page should give the HR a wholistic view of the data
//the total number of invited employees
//the total number of verified employees
//the current plan the company is on
//the total number of consults Dialogue has given(but in our project we don't talk to Dialogues API)
var DashBoard = React.createClass({
	render: function() {
		return (
			<div>
			<h2>DashBoard</h2>
					<Card>
						<CardHeader title="Total Number of Invited Employees"/>
						<CardText></CardText>
					{/*card action button should direct the user to the AccountsPage*/}
						<CardActions><FlatButton label="See detail"/></CardActions>
					</Card>
					<Card>
						<CardHeader title="Total Number of Signed-up Employees"/>
						<CardText></CardText>
					{/*card action button should direct the user to the AccountsPage*/}
						<CardActions><FlatButton label="See detail"/></CardActions>
					</Card>
					<Card>
						<CardHeader title="Current Plan"/>
					{/*the content for cardText below should be the plan chosen by the company and the number of its benefiting employees*/}
						<CardText></CardText>
					{/*card action button should direct the user to the plansPage*/}
						<CardActions><FlatButton label="Other plans"/></CardActions>
					</Card>
			</div>
		)
	},

});

export default DashBoard;