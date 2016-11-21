import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {browserHistory} from 'react-router';
require('es6-promise').polyfill();
require('isomorphic-fetch');
//localStorage is a global variable where we save the token

var SignUpForm = React.createClass({
	_signUpUser: function() {
		var data = {
			companyName: this.refs.companyName.getValue(),
			firstName: this.refs.firstName.getValue(),
			lastName: this.refs.lastName.getValue(),
			email: this.refs.email.getValue(),
			password: this.refs.password.getValue()
		};
		fetch('http://localhost:1337/api/signup', {
			method: 'POST', 
			body: JSON.stringify(data),
			headers: {'content-type': 'application/json'}
			})
			.then(function(response) {
		       	if (response.status >= 400) {
	            throw new Error("Bad response from server");
		        }
		        return response.json();
		    })
			//result comes back as a json property
		    .then(function(result) {
		    	console.log('sign up a new user', result);
		    	localStorage.token = result;
		    	
		    	//the local Storage will receive a token obtained from the api call made to auth0
		    	//this token will become the proof that our user has signed in already and next
		    	//we direct the user to the dashboard page
		    	//using the browsering history function form the react router
		    	browserHistory.push('/dashboard');
		    	//the above codes redirect the signed up users to the dashboard; 
		    	//Need to pass the user's info to UI components
			});
	},
	render: function() {
		return (
				<div
					style={{
					fontFamily: 'Roboto, sans-serif',
					color: '#40C4FF',
				    width: '50%',
				    margin: 'auto',
				    padding: '5em',
				    backgroundColor: '#E1F5FE',
				    borderRadius: '5px',
				    textAlign: 'center'
			    }}> 
			    	<h2>Sign Up</h2>
					<TextField
					  ref="companyName"
				      hintText="Company Name"
				      floatingLabelText="Company Name"
				      type="text"
				    /><br />
				    <TextField
				      ref="firstName"
				      hintText="Your First Name"
				      floatingLabelText="First Name"
				      type="text"
				    /><br />
				    <TextField
				      ref="lastName"
				      hintText="Your Last Name"
				      floatingLabelText="Last Name"
				      type="text"
				    /><br />
				    <TextField
				      ref="email"
				      hintText="Email Address"
				      floatingLabelText="Email Address"
				      type="text"
				    /><br />
				    <TextField
				      ref="password"
				      hintText="Password"
				      floatingLabelText="Password"
				      type="password"
				    /><br />
				    <FlatButton 
				    	onClick={this._signUpUser}
				    	backgroundColor='#40C4FF' 
				    	label="Submit" 
				    	primary={true}
				    	style={{color: '#E1F5FE', marginTop: '12px'}} 
				    />
				</div>
		);
	}

});

export default SignUpForm;