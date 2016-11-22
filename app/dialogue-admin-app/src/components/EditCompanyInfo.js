import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

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


var EditCompanyInfo = React.createClass({
	_udpateCompany: function() {
		var data = {
			updatedCompanyName: this.refs.updatedCompanyName.getValue(),
		};
		fetch('http://localhost:1337/api/company', {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Authorization': 'Bearer ' + localStorage.token,
				'content-type': 'application/json'}
		})
		.then(function(response) {
	       	if (response.status >= 400) {
            throw new Error("Bad response from server");
	        }
	        return response.json();
		})
	},
	render: function() {
		return (
				<div style={style}>
			    	<h2>Update Company Information</h2>

					<TextField
						ref="updatedCompanyName"
				        hintText="Company Name"
				        floatingLabelText="Company Name"
				        type="text"
				    />
				    {/*
				    <TextField
				    	ref="updatedAddress"
				        hintText="Address"
				        floatingLabelText="Address"
				        type="text"
				    />
				    <TextField
				    	ref="updatedPostcode"
				      	hintText="Postal Code"
				      	floatingLabelText="Postal Code"
				      	type="text"
				    /><br />
				*/}
				    <FlatButton
				    	onClick={this._udpateCompany}
				    	backgroundColor='#40C4FF'
				    	label="Submit"
				    	primary={true}
				    	style={{color: '#E1F5FE', marginTop: '12px'}}
				    />
				</div>
		);
	}

});

export default EditCompanyInfo;
