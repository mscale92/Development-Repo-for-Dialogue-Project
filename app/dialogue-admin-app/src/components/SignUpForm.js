import React from 'react';
import {browserHistory} from 'react-router';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

require('es6-promise').polyfill();
require('isomorphic-fetch');
//localStorage is a global variable where we save the token

const main = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	backgroundColor: '#E1F5FE',
	alignItems: 'center',
    height: '100vh',
	fontFamily: 'Roboto, sans-serif',
	textAlign: 'center',
}


var SignUpForm = React.createClass({
	getInitialState: function () {
		return {}
	},

	onChange: function(id, event) {

		if(id === 'company_name') {
			this.setState({
				companyNameFieldValue: event.target.value,
			});
			if(event.target.value === '') {
				this.setState({
					companyNameErrorText: 'Field cannot be empty'
				});
			}
			else {
				this.setState({
					companyNameErrorText: ''
				});
			}
		}
		else if(id === 'first_name') {
			this.setState({
				firstNameFieldValue: event.target.value,
			});
			if(event.target.value === '') {
				this.setState({
					firstNameErrorText: 'Field cannot be empty'
				});
			}
			else {
				this.setState({
					firstNameErrorText: ''
				});
			}
		}
		else if (id === 'last_name') {
			this.setState({
				lastNameFieldValue: event.target.value,
			});
			if(event.target.value === '') {
				this.setState({
					lastNameErrorText: 'Field cannot be empty'
				});
			}
			else {
				this.setState({
					lastNameErrorText: ''
				});
			}
		}
		else if(id === 'email') {
			this.setState({
				emailFieldValue: event.target.value,
			});
			if(event.target.value === '') {
				this.setState({
					emailErrorText: 'Field cannot be empty'
				});
			}
			else {
				this.setState({
					emailErrorText: ''
				});
			}
		}
		else if (id === 'password') {
			this.setState({
				passwordFieldValue: event.target.value,
			});
			if(event.target.value === '') {
				this.setState({
					passwordErrorText: 'Field cannot be empty'
				});
			}
			else {
				this.setState({
					passwordErrorText: ''
				});
			}
		}
	},
	_signUpUser: function() {
		var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!reg.test(this.state.emailFieldValue)) {
			this.setState({emailErrorText: 'Email format should be "john@doe.com"'});
			return;
		}
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
			.then(response => {	
		        return response.json();
		    })
			//result comes back as a json property
		    .then(result => {
		    	if (result.message === 'ERROR') {

					this.setState({formErrorMessage: 'Sorry, something went wrong. Please check your input.'})
				}
				else {
		    	localStorage.token = result;
		    	//the local Storage will receive a token obtained from the api call made to auth0
		    	//this token will become the proof that our user has signed in already and next
		    	//we direct the user to the dashboard page
		    	//using the browsering history function form the react router
		    	browserHistory.push('/dashboard');
		    	//the above codes redirect the signed up users to the dashboard;
		    	//Need to pass the user's info to UI components
		    	}
			});
	},
	render: function() {
		var emptyInputs = !(this.state.companyNameFieldValue && this.state.firstNameFieldValue && this.state.lastNameFieldValue && this.state.emailFieldValue && this.state.passwordFieldValue);
		return (
				<div style={main}>
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
								errorText={this.state.companyNameErrorText}
								onChange={this.onChange.bind(this, 'company_name')}
					    /><br />
					    <TextField
					      ref="firstName"
					      hintText="Your First Name"
					      floatingLabelText="First Name"
					      type="text"
								errorText={this.state.firstNameErrorText}
								onChange={this.onChange.bind(this, 'first_name')}
					    /><br />
					    <TextField
					      ref="lastName"
					      hintText="Your Last Name"
					      floatingLabelText="Last Name"
					      type="text"
								errorText={this.state.lastNameErrorText}
								onChange={this.onChange.bind(this, 'last_name')}
					    /><br />
					    <TextField
								ref="email"
						    hintText="Email Address"
					    	floatingLabelText="Email Address"
					    	type="text"
								errorText={this.state.emailErrorText}
								onChange={this.onChange.bind(this, 'email')}
					    /><br />
					    <TextField
								ref="password"
						    hintText="Password"
						    floatingLabelText="Password"
						    type="password"
								errorText={this.state.passwordErrorText}
								onChange={this.onChange.bind(this, 'password')}
					    /><br />
				    </div>
				    <div>
				    <FlatButton
				    	onClick={this._signUpUser}
				    	backgroundColor={emptyInputs ? '#E0E0E0':'#40C4FF'}
				    	label="Submit"
				    	primary={true}
				    	style={{color: emptyInputs ? '#BDBDBD':'#E1F5FE', margin: '12px'}}
							disabled={emptyInputs}
				    />
				    <FlatButton
				    	href="/"
				    	backgroundColor='#40C4FF'
				    	label="Go back"
				    	primary={true}
				    	style={{color: '#E1F5FE', margin: '12px'}}
				    />
				    </div>
					<p style={{color:'red'}}>{this.state.formErrorMessage}</p>
			</div>
		);
	}

});

export default SignUpForm;
