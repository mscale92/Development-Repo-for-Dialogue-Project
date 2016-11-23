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
  onChange: function(id, event) {

    if(id === 'first_name') {
      this.setState({
        firstNameFieldValue: event.target.value,
      });
      if(event.target.value === '') {
        this.setState({
          firstNameErrorText: 'Field cannot be empty'
        });
      }
      else {
        this.setState({
          firstNameErrorText: ''
        });
      }
    }
    else if (id === 'last_name') {
      this.setState({
        lastNameFieldValue: event.target.value,
      });
      if(event.target.value === '') {
        this.setState({
          lastNameErrorText: 'Field cannot be empty'
        });
      }
      else {
        this.setState({
          lastNameErrorText: ''
        });
      }
    }
    else if(id === 'email') {
      this.setState({
        emailFieldValue: event.target.value,
      });
      if(event.target.value === '') {
        this.setState({
          emailErrorText: 'Field cannot be empty'
        });
      }
      else {
        this.setState({
          emailErrorText: ''
        });
      }
    }
  },
	_createNewUser: function() {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!reg.test(this.state.emailFieldValue)) {
      this.setState({emailErrorText: 'Email format should be "john@doe.com"'});
      return;
    }
		var data = {
			firstName: this.refs.firstName.getValue(),
			lastName: this.refs.lastName.getValue(),
			email: this.refs.email.getValue(),
			password: "123456",
		};
    var that = this;
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
      if(result.message === "ERROR"){
        that.setState({
          formErrorMessage: "There was an error, please check your input, email might already exist."
        })
        return;
      }
      else {
        browserHistory.push('/accounts');
      }
		})
	},
	render: function() {
    var emptyInputs = !(this.state.firstNameFieldValue && this.state.lastNameFieldValue && this.state.emailFieldValue);
		return (
				<div style={style}>
			    	<h2>Create a New Employee Account</h2>
				 	<TextField
            ref="firstName"
            hintText="Your First Name"
            floatingLabelText="First Name"
            type="text"
            errorText={this.state.firstNameErrorText}
            onChange={this.onChange.bind(this, 'first_name')}
				  /><br />
				  <TextField
             ref="lastName"
             hintText="Your Last Name"
             floatingLabelText="Last Name"
             type="text"
             errorText={this.state.lastNameErrorText}
             onChange={this.onChange.bind(this, 'last_name')}
				  /><br />
					<TextField
            ref="email"
            hintText="Email Address"
            floatingLabelText="Email Address"
            type="text"
            errorText={this.state.emailErrorText}
            onChange={this.onChange.bind(this, 'email')}
				  /><br />
				    {
				    	this.state.error ? <span style={{color: '#D32F2F'}} className="error">{this.state.error}</span> : null
				    }
				    <br />
				    <FlatButton
				    	onClick={this._createNewUser}
				    	backgroundColor={emptyInputs ? '#E0E0E0':'#40C4FF'}
				    	label="Create"
				    	primary={true}
				    	style={{color: emptyInputs ? '#BDBDBD':'#E1F5FE', marginTop: '12px'}}
 					/>
          <p style={{color:'red'}}>{this.state.formErrorMessage}</p>
				</div>
		);
	}

});

export default CreateNewAccountForm;
