import React from 'react';
import {browserHistory} from 'react-router';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

require('es6-promise').polyfill();
require('isomorphic-fetch');
//localStorage is a global variable where we save the token

const main = {
	display: 'flex',
	justifyContent: 'center',
	backgroundColor: '#E1F5FE',
	alignItems: 'center',
    height: '100vh',
	fontFamily: 'Roboto, sans-serif',
	textAlign: 'center',
}


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
				<div style={main}> 
					<div>
				    	<div>
							<img role='presentation' src={require('../img/logo.png')}/>
							<h3>SIGN UP</h3>
						</div>
						<div>
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
					    </div>
					    <FlatButton 
					    	onClick={this._signUpUser}
					    	backgroundColor='#40C4FF' 
					    	label="Submit" 
					    	primary={true}
					    	style={{color: '#E1F5FE', margin: '12px'}} 
					    />
					    <FlatButton
					    	href="/"
					    	backgroundColor='#40C4FF' 
					    	label="Go back" 
					    	primary={true}
					    	style={{color: '#E1F5FE', margin: '12px'}} 
					    />
					    </div>
				</div>
		);
	}

});

export default SignUpForm;