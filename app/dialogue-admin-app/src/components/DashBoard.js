import React from 'react';
import {browserHistory} from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

//this is the main page the HR manager will see after logging in
//this page should give the HR a wholistic view of the data
//the total number of invited employees
//the total number of verified employees
//the current plan the company is on
//the total number of consults Dialogue has given(but in our project we don't talk to Dialogues API)



const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    height: '100vh',
    marginTop: '30vh'
}

var DashBoard = React.createClass({
	getInitialState: function() {
		return {};
	},

	//On component mount
	componentDidMount: function() {
		var that = this;
		//Gets the company's current plan
		this._getCurrentPlan()
		.then(currentPlan => {
			that.setState({
				currentPlan: currentPlan
			});
		});
	},

	//Fetch get request to get the company's current plan from Stripe
	_getCurrentPlan: function(){
		return fetch('http://localhost:1337/api/currentplan', {
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

	render: function() {
		if(!this.state.currentPlan){
			return (
				<div style={style}>
					<CircularProgress/>
				</div>
			)
		}
		return (
			<div>
			<h2>Dashboard</h2>
					<Card>
						<CardHeader title="Overview"/>
						<CardText>{"Number of employees: " + this.state.currentPlan.subscriptionQuantity}</CardText>
            <CardText>{"Payment per employee: $CAD " + this.state.currentPlan.plan.amount/100}</CardText>
            <CardText>{"Total payment per month: $CAD " + (this.state.currentPlan.subscriptionQuantity * this.state.currentPlan.plan.amount)/100}</CardText>
					{/*card action button should direct the user to the AccountsPage*/}
						<CardActions><FlatButton label="View employee details" onClick={() => browserHistory.push('/accounts')} /></CardActions>
					</Card>
					<Card>
						<CardHeader title="Current Plan"/>
					{/*the content for cardText below should be the plan chosen by the company and the number of its benefiting employees*/}
						<CardText>{this.state.currentPlan.plan.metadata.description}</CardText>
					{/*card action button should direct the user to the plansPage*/}
						<CardActions><FlatButton label="View other plans" onClick={() => browserHistory.push('/plans')} /></CardActions>
					</Card>
			</div>
		)
	},

});

export default DashBoard;
