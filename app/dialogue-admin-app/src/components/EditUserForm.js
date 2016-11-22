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
	_editUser: function() {
		var currentUserInfo = {
			updatedFirstName: this.refs.updatedFirstName.getValue(),
			updatedLastName: this.refs.updatedLastName.getValue(),
			updatedEmail: this.refs.updatedEmail.getValue(),
		};
		fetch('', {
		method: 'PATCH', 
		body: JSON.stringify(currentUserInfo),
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