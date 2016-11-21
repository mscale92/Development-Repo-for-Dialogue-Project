import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {browserHistory} from 'react-router';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const style = {
		fontFamily: 'Roboto, sans-serif',
		color: '#40C4FF',
	    width: '50%',
	    margin: 'auto',
	    padding: '5em',
	    backgroundColor: '#E1F5FE',
	    borderRadius: '5px',
	    textAlign: 'center'
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
				<div style={style}>
					<h2>Log in</h2>
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
				    	onClick={this._loginUser}
				    	backgroundColor='#40C4FF' 
				    	label="Log in" 
				    	primary={true}
				    	style={{color: '#E1F5FE', marginTop: '12px'}} 
				    />
				</div>
		);
	}

});

export default LogInForm;