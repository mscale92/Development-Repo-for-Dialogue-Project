//Screen for Plans

import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {browserHistory} from 'react-router';


//Progressing icon style

const style = {
	display: 'flex',
	justifyContent: 'center',
	alignItem: 'center',
	height: '100vh',
	marginTop: '30vh'
}

const childStyle ={
	height: '25%'
}

const currentPlanIconStyle = {
	color: 'white',
	paddingTop: '3px'
}

var PlansPage = React.createClass({
	//Sets initial state to empty object
	getInitialState: function() {
		return {};
	},
	//On component mount
	componentDidMount: function() {
		//Gets the data from all plans
		this._getPlans()
		.then(response => {
			this.setState({plansData: response.data});
		});
		//Gets the company's current plan
		this._getCurrentPlan()
		.then(response => {
			this.setState({getCurrentPlan: response.plan});
		});
		//Gets the company's current credit card, returns {doesNotExist: true} if it does not exist
		this._getCurrentCreditCard()
		.then(currentCreditCard => {
			this.setState({creditCard: currentCreditCard});
		})
	},
	//Fetch get request to get all plans from Stripe
	_getPlans: function(){
		return fetch('http://localhost:1337/api/plans', {
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

	//Fetch put request to update the company's current plan on Stripe
	_putCurrentPlan: function(){
		return fetch('http://localhost:1337/api/currentplan', {
			method: 'PUT',
			body: JSON.stringify({planToUpdate: this.state.updateToThisPlan}),
			headers: {
				'Authorization': 'Bearer ' + localStorage.token,
				'content-type': 'application/json'
			}
		})
		.then(function(response) {
			if (response.status >= 400) {
				throw new Error("Bad response from server");
			}
			else {
				return response;
			}
		});
	},

	//Fetch get request to check if the company has a credit card
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

	//Handles the plan update
	_handlePlanUpdate: function() {
		//Updates to the new plan
		this._putCurrentPlan()
		.then(response => {
			//Returns the newly updated plan
			return this._getCurrentPlan();
		})
		.then(response => {
			//Sets the updated plan to state getCurrentPlan
			//Sets the plan to updateToThisPlan to false
			this.setState({
				getCurrentPlan: response.plan,
				updateToThisPlan: false
			});
		});
	},

	//Clears the plan to update to when clicking "Cancel" or outside of the dialog
	_handleClose: function(){
		this.setState({updateToThisPlan: false});
	},

	//Renders each plan
  _renderPlans: function(plan) {
  	return (
			<Paper className="big" style={{margin: '0.5em', width: '25%', padding: '1em'}} zDepth={2} >
				<div className="paper" style={{"display": "flex", "flexFlow": "column", height: '100%'}}>
					<h3 style={childStyle}>{plan.name}</h3>
					<p style={childStyle}>{plan.metadata.description}</p>
					{/*The raw data we receive from Stripe api is in cents*/}
					<h4 style={childStyle}>$CAD {plan.amount/100}  / user each Month</h4>
					{/*The label below reflects the company's current plan, and possible plan updates*/}
					<RaisedButton
						
					 	label = {plan.id===this.state.getCurrentPlan.id ? <FontIcon style={currentPlanIconStyle} className="material-icons">check</FontIcon> : 'Update'}
						disabled = {plan.id===this.state.getCurrentPlan.id ? true : false}
						fullWidth={true}
						secondary={true}
						onTouchTap={() => this.setState({updateToThisPlan: plan.id})}
					/>
				</div>
			</Paper>
		);
  },

	//Renders the component
  render() {
		if (!this.state.plansData) {
			return (
				<div style={style}>
					<CircularProgress />
				</div>
			);
		}
		var plans = this.state.plansData;
			{/*The "Cancel" button triggers the _handleClose to clear the updateToThisPlan state and close */}
			{/*The "Update" button triggers the _handlePlanUpdate function to update the plan update*/}
    	const actionsButtons = [
			<FlatButton
		    label="Cancel"
		    primary={true}
		    onTouchTap={this._handleClose}
		  />,
		  <FlatButton
		    label={this.state.creditCard.doesNotExist ? "Register credit card" : "Update"}
		    primary={true}
		    onTouchTap={this.state.creditCard.doesNotExist ? () => browserHistory.push('/editcard') : this._handlePlanUpdate}
		  />
		];
	    return (
	    	<div>
	        <h2>Plan Options</h2>
	    		<div style={{display: 'flex'}}>
	    			{plans.map(this._renderPlans)}
	    			<Dialog
		          actions={actionsButtons}
		          modal={false}
		          open={this.state.updateToThisPlan ? true:false}
		          onRequestClose={this._handleClose}
		        >
						{this.state.creditCard.doesNotExist ?
							"You must register a credit card to update to the " + this.state.updateToThisPlan + " plan." :
							"Are you sure to update to the "+ this.state.updateToThisPlan + " plan?"}
		        </Dialog>
	  			</div>
  			</div>
	    );
	  }
});

export default PlansPage;
