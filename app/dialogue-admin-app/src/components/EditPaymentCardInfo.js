import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {browserHistory} from 'react-router';

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
			number: this.refs.number.getValue(),
			exp_month: this.refs.exp_month.getValue(),
			exp_year: this.refs.exp_year.getValue(),
			cvc: this.refs.cvc.getValue(),
		};
		fetch('http://localhost:1337/api/creditcard', {
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
					else {
						return response.json();
					}
		})
		.then(function(result){
			browserHistory.push('/billing');
		})
	},
	render: function() {
		return (
				<div style={style}>
			    	<h2>Update Payment Information</h2>
				    <TextField
				    	ref="number"
				        hintText="Credit Card Number"
				        floatingLabelText="Credit Card Number"
				        type="text"
				    /><br />
				    <TextField
				      	ref="exp_month"
				        hintText="mm"
				        floatingLabelText="Month"
				        type="text"
				    /><br />
				    <TextField
				    	ref="exp_year"
				        hintText="YY"
				        floatingLabelText="Year"
				        type="text"
				    />
				    <TextField
				    	ref="cvc"
				        hintText="CVC"
				        floatingLabelText="CVC"
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
