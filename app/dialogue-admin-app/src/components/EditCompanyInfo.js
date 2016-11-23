import React from 'react';
import {browserHistory} from 'react-router';

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
	getInitialState: function () {
		return {}
	},

	onChange: function(id, event) {
		if(id === 'company_name') {
			this.setState({
				companyNameFieldValue: event.target.value,
			});
			if(event.target.value === '') {
				this.setState({
					companyNameErrorText: 'Company name cannot be empty'
				});
			}
			else {
				this.setState({
					companyNameErrorText: ''
				});
			}
		}
	},
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
		.then(response=>{
			browserHistory.push('/dashboard');
		})
	},
	render: function() {
		var emptyInputs = !this.state.companyNameFieldValue;
		return (
				<div style={style}>
			    	<h2>Update Company Information</h2>

					<TextField
						ref="updatedCompanyName"
				        hintText="Updated Company Name"
				        floatingLabelText="Updated Company Name"
								type="text"
								errorText={this.state.companyNameErrorText}
								onChange={this.onChange.bind(this, 'company_name')}
				    />
				    <FlatButton
				    	onClick={this._udpateCompany}
				    	backgroundColor={emptyInputs ? '#E0E0E0':'#40C4FF'}
				    	label="Submit"
							primary={true}
							style={{color: emptyInputs ? '#BDBDBD':'#E1F5FE', margin: '12px'}}
							disabled={emptyInputs}
				    />
				</div>
		);
	}

});

export default EditCompanyInfo;
