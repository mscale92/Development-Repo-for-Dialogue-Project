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
    margin: '0 auto',
    padding: '5em',
    backgroundColor: '#E1F5FE',
    borderRadius: '5px',
    textAlign: 'center'
}

var CreateNewAccountForm = React.createClass({
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
	       	if (response.status >= 400) {
            throw new Error("Bad response from server");
	        }
	        return response.json();
		})
		.then(function(result){
			browserHistory.push('/accounts');
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
				    <FlatButton 
				    	onClick={this._createNewUser}
				    	backgroundColor='#40C4FF' 
				    	label="Create" 
				    	primary={true}
				    	style={{color: '#E1F5FE', marginTop: '12px'}}
 					/>
 					<h3>DEV All passwords are 123456 until customized emails are set up DEV</h3>
				</div>
		);
	}

});

export default CreateNewAccountForm;