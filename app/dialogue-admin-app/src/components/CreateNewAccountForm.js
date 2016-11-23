import React from 'react';
import {browserHistory} from 'react-router';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const style = {
 	fontFamily: 'Roboto, sans-serif',
	color: '#40C4FF',
    width: '50%',
    margin: '0 auto',
    padding: '5em',
    backgroundColor: '#E1F5FE',
    borderRadius: '5px',
    textAlign: 'center'
}

var CreateNewAccountForm = React.createClass({
	getInitialState: function() {
		return {};
	},
	_createNewUser: function() {
		var data = {
			firstName: this.refs.firstName.getValue(),
			lastName: this.refs.lastName.getValue(),
			email: this.refs.email.getValue(),
			password: "123456",
		};
		fetch('http://localhost:1337/api/users', {
			method: 'POST', 
			body: JSON.stringify(data),
			headers: {
				'Authorization': 'Bearer ' + localStorage.token, 
				'content-type': 'application/json'
			}
		})
		.then(function(response) {
	        return response.json();
		})
		.then(result => {
			if (result.statusCode !== 200 && result.statusCode) {
				console.log('code', result.statusCode)
				var err;
				try {
					err = JSON.parse(result.message);
				}
				catch(e) {
					err  = {message: "Unknown error, please try again later"};
				}

				this.setState({
					error: err.message
				});
			}
			else {
				browserHistory.push('/accounts');
			}
		})
	},
	render: function() {
		return (
				<div style={style}>
			    	<h2>Create a New Employee Account</h2>
				 	<TextField
				 		ref="firstName"
				        hintText="First Name"
				        floatingLabelText="First Name"
				        type="text"
				    /><br />
				     <TextField
				    	ref="lastName"
				      	hintText="Last Name"
				      	floatingLabelText="Last Name"
				      	type="text"
				    /><br />
					<TextField
						ref="email"
				        hintText="Email Address"
				        floatingLabelText="Email Address"
				        type="text"
				    /><br />
				    {
				    	this.state.error ? <span style={{color: '#D32F2F'}} className="error">{this.state.error}</span> : null
				    }
				    <br />
				    <FlatButton 
				    	onClick={this._createNewUser}
				    	backgroundColor='#40C4FF' 
				    	label="Create" 
				    	primary={true}
				    	style={{color: '#E1F5FE', marginTop: '12px'}}
 					/>
				</div>
		);
	}

});

export default CreateNewAccountForm;