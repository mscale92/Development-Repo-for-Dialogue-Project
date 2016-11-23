import React from 'react';
import {browserHistory} from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';


//this is the main page the HR manager will see after logging in
//this page should give the HR a wholistic view of the data
//the total number of invited employees
//the total number of verified employees
//the current plan the company is on
//the total number of consults Dialogue has given(but in our project we don't talk to Dialogues API)

const style = {
	progressingIconStyle: {
	    display: 'flex',
	    justifyContent: 'center',
	    alignItem: 'center',
	    height: '100vh',
	    marginTop: '30vh'
	},
	paperStyle: {
		margin: '0.5em',
		padding: '2em',
	},
	paperParent:{
		width: '25%',
		cursor: 'pointer'
	},
	iconStyle: {
		fontSize: '90px',
		color: '#BDBDBD',
	},
	numberTextStyle: {
	fontSize:'25px'
	},
	textStyle: {
		fontSize: '12px',
		color: '#ff4081',
	},
	divStyle: {
		display: 'flex'
	}

}

var DashBoard = React.createClass({
	getInitialState: function() {
		return {};
	},
	handleMouseLeave: (event) => {
	    // hover is needed only when a hoverColor is defined
	    if (this.props.hoverColor !== undefined) {
	      this.setState({hovered: false});
	    }
	    if (this.props.onMouseLeave) {
	      this.props.onMouseLeave(event);
	    }
  	},

  	handleMouseEnter: (event) => {
	    // hover is needed only when a hoverColor is defined
	    if (this.props.hoverColor !== undefined) {
	      this.setState({hovered: true});
	    }
	    if (this.props.onMouseEnter) {
	      this.props.onMouseEnter(event);
	    }
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
		})
		.then(()=>{
			return that._getCompanyName()
		})
		.then(company => {
			that.setState({
				companyName: company.companyName
			})
		})
	},
	_getCompanyName: function(){
		return fetch('http://localhost:1337/api/company', {
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

	render: function() {
		if(!this.state.currentPlan || !this.state.companyName){
			return (
				<div style={style.progressingIconStyle}>
					<CircularProgress/>
				</div>
			)
		}
		return (
			<div>
				<h2>{this.state.companyName} Dashboard</h2>
				<div style={{display: 'flex', textAlign: 'center'}}>

					<div onClick={() => browserHistory.push('/accounts')} className='paper' zDepth={2} style={style.paperParent}>
						<Paper style={style.paperStyle}>
							<FontIcon style={style.iconStyle} className="material-icons">sentiment_satisfied</FontIcon>
							<h2 style={style.numberTextStyle}>{this.state.currentPlan.subscriptionQuantity}</h2>
							<h3 style={style.textStyle}>HEALTHY EMPLOYEES</h3>
						</Paper>
					</div>

					<div onClick={() => browserHistory.push('/billing')} className='paper' zDepth={2} style={style.paperParent}>
						<Paper style={style.paperStyle}>
							<FontIcon style={style.iconStyle} className="material-icons">attach_money</FontIcon>
							<h2 style={style.numberTextStyle}>${this.state.currentPlan.plan.amount/100}</h2>
							<h3 style={style.textStyle}>PER USER</h3>
						</Paper>
					</div>

					<div onClick={() => browserHistory.push('/billing')} className='paper' zDepth={2} style={style.paperParent}>
						<Paper style={style.paperStyle}>
							<FontIcon style={style.iconStyle} className="material-icons">account_balance</FontIcon>
							<h2 style={style.numberTextStyle}>${(this.state.currentPlan.subscriptionQuantity * this.state.currentPlan.plan.amount)/100}</h2>
							<h3 style={style.textStyle}>PER MONTH</h3>
						</Paper>
					</div>

					<div onClick={() => browserHistory.push('/plans')} className='paper' zDepth={2} style={style.paperParent}>
						<Paper style={style.paperStyle}>
							<FontIcon style={style.iconStyle} className="material-icons">favorite_border</FontIcon>
							<h2 style={style.numberTextStyle}>{this.state.currentPlan.plan.name}</h2>
							<h3 style={style.textStyle}>CURRENT PLAN</h3>
						</Paper>
					</div>

				</div>
			</div>

		)
	},

});

export default DashBoard;
