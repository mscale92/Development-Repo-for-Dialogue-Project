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

var EditPaymentCardInfo = React.createClass({
	getInitialState: function(){
		return {}
	},
	onChange: function(id, event) {
		var reg = new RegExp('^\\d+$');
		//Credit card input handling
		if(id === 'credit_card_number'){
			this.setState({
				creditCardNumberValue: event.target.value
			});
			if(reg.test(event.target.value) || event.target.value === '') {
				this.setState({creditCarNumberErrorText: ''});
			}
			else {
				this.setState({creditCarNumberErrorText: 'Input must be numbers only'});
			}
		}
		else if (id === 'exp_month') {
			var numberValue = parseInt(event.target.value);
			this.setState({
				creditCardMonthValue: event.target.value
			});
			if(event.target.value === '' || (reg.test(event.target.value) && numberValue >= 1 && numberValue <= 12)) {
				this.setState({monthErrorText: ''});
			}
			else {
				this.setState({monthErrorText: 'Input must be a number between 1 and 12'});
			}
		}
		else if (id === 'exp_year') {
			this.setState({
				creditCardYearValue: event.target.value
			});
			if(reg.test(event.target.value) || event.target.value === '') {
				this.setState({yearErrorText: ''});
			}
			else {
				this.setState({yearErrorText: 'Input must be numbers only'});
			}
		}
		else if (id === 'cvc') {
			this.setState({
				creditCardCVCValue: event.target.value
			});
			if(reg.test(event.target.value) || event.target.value === '') {
				this.setState({cvcErrorText: ''});
			}
			else {
				this.setState({cvcErrorText: 'Input must be numbers only'});
			}
		}
	},
	_updateCard: function() {
		if (this.state.creditCardNumberValue.length <= 14){
			this.setState({creditCarNumberErrorText: 'Credit card number should be 15 or 16 digits long'})
			return;
		}
		if (this.state.creditCardCVCValue.length <= 2) {
			this.setState({cvcErrorText: 'Credit card CVC should be 3 or 4 digits long'})
			return;
		}
		// var currentDate = new Date()
		// var creditCardDate = new Date('20'+this.state.creditCardYearValue, this.state.creditCardMonthValue, 30)
		var data = {
			number: this.refs.number.getValue(),
			exp_month: this.refs.exp_month.getValue(),
			exp_year: this.refs.exp_year.getValue(),
			cvc: this.refs.cvc.getValue(),
		};
		var that = this;
		fetch('http://localhost:1337/api/creditcard', {
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
		.then(function(result){
			if(result.message === "ERROR"){
				that.setState({
					formErrorMessage: "There was an error, please check that your card is still valid."
				})
				return;
			}
			else {
				browserHistory.push('/billing');
			}
		});
	},
	render: function() {
		var errorStates = this.state.creditCarNumberErrorText || this.state.monthErrorText || this.state.yearErrorText || this.state.cvcErrorText;
		var emptyInputs = !(this.state.creditCardNumberValue && this.state.creditCardMonthValue && this.state.creditCardYearValue && this.state.creditCardCVCValue);
		return (
				<div style={style}>
			    	<h2>Update Payment Information</h2>
				    <TextField
				    	ref="number"
			        hintText="Credit Card Number"
			        floatingLabelText="Credit Card Number"
			        type="text"
							maxLength="16"
							errorText={this.state.creditCarNumberErrorText}
							onChange={this.onChange.bind(this, 'credit_card_number')}
				    /><br />
				    <TextField
			      	ref="exp_month"
			        hintText="MM"
			        floatingLabelText="Month"
			        type="text"
							maxLength="2"
							errorText={this.state.monthErrorText}
							onChange={this.onChange.bind(this, 'exp_month')}
				    /><br />
				    <TextField
				    	ref="exp_year"
			        hintText="YY"
			        floatingLabelText="Year"
			        type="text"
							maxLength="2"
							errorText={this.state.yearErrorText}
							onChange={this.onChange.bind(this, 'exp_year')}
				    /><br />
				    <TextField
				    	ref="cvc"
			        hintText="CVC"
			        floatingLabelText="CVC"
			        type="text"
							maxLength="4"
							errorText={this.state.cvcErrorText}
							onChange={this.onChange.bind(this, 'cvc')}
				    /><br />
				    <FlatButton
				    	onClick={this._updateCard}
				    	backgroundColor= {(emptyInputs || errorStates) ? '#E0E0E0':'#40C4FF'}
				    	label="Submit"
				    	primary={true}
				    	style={{color: (emptyInputs || errorStates) ? '#BDBDBD':'#E1F5FE', marginTop: '12px'}}
							disabled={emptyInputs || errorStates}
				    />
						<p style={{color:'red'}}>{this.state.formErrorMessage}</p>
				</div>
		);
	}
});

export default EditPaymentCardInfo;
