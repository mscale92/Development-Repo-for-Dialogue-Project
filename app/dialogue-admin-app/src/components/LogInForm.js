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
				emailErrorText: ''
			});
		}
		else if (id === 'password') {
			this.setState({
				passwordFieldValue: event.target.value
			});
		}
	},

	_loginUser: function() {
		var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!reg.test(this.state.emailFieldValue)) {
			this.setState({emailErrorText: 'Email format must be: something@something.something'});
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
			if (result.statusCode && result.statusCode !== 200) {
				var err;
				try {
					err = JSON.parse(result.message);
				}
				catch(e) {
					err  = {message: "Unknown error, please try again later"};
				}
				this.setState({error: err.error_description})
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
					    <div>
					    	{
				    		this.state.error ? <span style={{color: '#D32F2F'}} className="error">{this.state.error}</span> : null
				    		}
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
				    </div>
				</div>
		);
	}

});

export default LogInForm;
