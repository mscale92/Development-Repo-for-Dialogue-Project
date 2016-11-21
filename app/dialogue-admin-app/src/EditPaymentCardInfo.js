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
	_updateCard: function() {
		var data = {
			cardNumber: this.refs.cardNumber.getValue(),
			address: this.refs.address.getValue(),
			postCode: this.refs.postCode.getValue(),
			dateExpire: this.refs.dateExpire.getValue(),
			cvc: this.refs.cvc.getValue(),
		};
		fetch('', {
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

		})
	},
	render: function() {
		return (
				<div style={style}>
			    	<h2>Update Payment Information</h2>
				    <TextField
				    	ref="cardNumber"
				        hintText="Credit Card Number"
				        floatingLabelText="Credit Card Number"
				        type="text"
				    /><br />
				    <TextField
				    	ref="address"
				        hintText="Address"
				        floatingLabelText="Address"
				        type="text"
				    />
				    <TextField
				      	ref="postCode"
				        hintText="Postal Code"
				        floatingLabelText="Postal Code"
				        type="text"
				    /><br />
				    <TextField
				    	ref="dateExpire"
				        hintText="DD/MM/YY"
				        floatingLabelText="Card Expiration Date"
				        type="text"
				    />
				    <TextField
				    	ref="cvc"
				        hintText="CVC"
				        floatingLabelText="cvc"
				        type="text"
				    /><br />
				    <FlatButton
				    	onClick={this._updateCard}
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
