import React from 'react';
import {browserHistory} from 'react-router';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

require('es6-promise').polyfill();
require('isomorphic-fetch');
//localStorage is a global variable where we save the token

const editUserDialogStyle = {
	textAlign: 'center',
}


var EditUserForm = React.createClass({
	propTypes: {
		user: React.PropTypes.string
	},
	_editUser: function() {
		var that = this;
		// Give the users the option to enter only desired fields by testing for empty values

		//Format the empty object for the server
		var currentUserInfo = {
			user_metadata: {}
		};

		// Set some variables from the form values for ternary simplicity later 
		var firstName = this.refs.updatedFirstName.getValue()
		var lastName = this.refs.updatedLastName.getValue()
		var email = this.refs.updatedEmail.getValue()

		//If the field is empty, just null. Otherwise, add it to the object
		firstName.length !== 0 ? currentUserInfo.user_metadata.firstName = firstName : null;
		lastName.length !== 0 ? currentUserInfo.user_metadata.lastName = lastName : null;
		email.length !== 0 ? currentUserInfo.email = email : null;

		//Send the fetch Patch request
		fetch('http://localhost:1337/api/users/' + this.props.user, {
		method: 'PATCH', 
		body: JSON.stringify(currentUserInfo),
		headers: {'Authorization': 'Bearer ' + localStorage.token, 'content-type': 'application/json'}
		})
		.then(function(response) {
	       	if (response.status >= 400) {
            	throw new Error("Bad response from server");
	        	}
	        return response.json();
	    })
		//result comes back as a json property
	    .then(function(result) {
	    	
	    	browserHistory.push('/accounts');
		});

	},
	render: function() {
		return (
				<div style={editUserDialogStyle}>
					<div>
						<h3>Edit employee information</h3>
						<div>
					    <TextField
					      ref="updatedFirstName"
					      hintText="Updated First Name"
					      floatingLabelText="Updated First Name"
					      type="text"
					    /><br />
					    <TextField
					      ref="updatedLastName"
					      hintText="Updated Last Name"
					      floatingLabelText="Updated Last Name"
					      type="text"
					    /><br />
					    <TextField
					      ref="updatedEmail"
					      hintText="Updated Email Address"
					      floatingLabelText="Updated Email Address"
					      type="text"
					    /><br />
				    </div>
				    <FlatButton
				    	onClick={this._editUser}
				    	backgroundColor='#40C4FF'
				    	label="Submit"
				    	primary={true}
				    	style={{color: '#E1F5FE', margin: '12px'}}
				    />
					</div>
				</div>
		);
	}

});

export default EditUserForm;