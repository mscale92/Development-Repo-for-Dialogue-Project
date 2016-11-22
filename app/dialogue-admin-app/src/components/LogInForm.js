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
	_loginUser: function() {
		var data = {
			email: this.refs.email.getValue(),
			password: this.refs.password.getValue()
		};
		fetch('http://localhost:1337/api/login', {
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
		.then(function(result){

			localStorage.token = result;

			browserHistory.push('/dashboard');
		})
	},
	render: function() {
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
						    /><br />
						    <TextField
						    	ref="password"
							    hintText="Password"
							    floatingLabelText="Password"
							    type="password"
						    /><br />
					    </div>
					    <div style={buttonStyle}>
						    <FlatButton 
						    	onClick={this._loginUser}
						    	backgroundColor='#40C4FF' 
						    	label="Log in" 
						    	primary={true}
						    	style={{color: '#E1F5FE', margin: '12px'}} 
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