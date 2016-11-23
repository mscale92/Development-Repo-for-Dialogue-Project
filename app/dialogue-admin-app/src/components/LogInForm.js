import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {browserHistory} from 'react-router';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const main = {
	display: 'flex',
	justifyContent: 'center',
	backgroundColor: '#E1F5FE',
	alignItems: 'center',
  height: '100vh',
	fontFamily: 'Roboto, sans-serif',
	textAlign: 'center',
}

const buttonStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}


var LogInForm = React.createClass({
	getInitialState: function () {
		return {}
	},

	onChange: function(id, event) {
		if(id === 'email') {
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

	_loginUser: function() {
		var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!reg.test(this.state.emailFieldValue)) {
			this.setState({emailErrorText: 'Email format should be "john@doe.com"'});
			return;
		}

		var data = {
			email: this.refs.email.getValue(),
			password: this.refs.password.getValue()
		};
		fetch('http://localhost:1337/api/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {'content-type': 'application/json'}
		})
		.then(response => {
	        return response.json();
		})
		.then(result => {
			if (result.message === 'ERROR') {
				//the below is ziad's codes for error handling when we get a useful error msg from server
			// 	var err;
			// 	try {
			// 		err = JSON.parse(result);
			// 		console.log('2', err)

			// 	}
			// 	catch(e) {
			// 		err  = {message: "Sorry, this user might not exist"};
			// 		console.log('3', e)

			// 	}
			// 	this.setState({error: err})
			// 	console.log('4', this.state)

			// }
			//we have modified on the server side to send the same object every time if something went wrong; this is not the best fix, sometimes auth0 api error msg has more userful info 
				this.setState({formErrorMessage: 'Sorry, something went wrong. Please check your email or password.'})
			}
			else {
				localStorage.token = result;
				browserHistory.push('/dashboard');
			}
		})
	},
	render: function() {
		var emptyInputs = !(this.state.emailFieldValue && this.state.passwordFieldValue);
		return (
				<div style={main}>
					<div>
					 	<div>
							<img role='presentation' src={require('../img/logo.png')}/>
							<h3>LOG IN</h3>
						</div>
						<div>
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
					    <div style={buttonStyle}>
						    <FlatButton
						    	onClick={this._loginUser}
						    	backgroundColor={emptyInputs ? '#E0E0E0':'#40C4FF'}
						    	label="Log in"
						    	primary={true}
						    	style={{color: emptyInputs ? '#BDBDBD':'#E1F5FE', margin: '12px'}}
									disabled={emptyInputs}
						    /><br />
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
				</div>
		);
	}

});

export default LogInForm;
