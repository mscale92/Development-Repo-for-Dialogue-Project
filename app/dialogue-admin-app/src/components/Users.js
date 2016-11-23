import React from 'react';
import {browserHistory} from 'react-router';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const style = {
	main: {
		display: 'flex',
		justifyContent: 'center',
		alignItem: 'center',
		height: '100vh',
		marginTop: '30vh'
	},
	iconStyle: {
		color: '#BDBDBD',
 		margin: '0.3em'
	}
}

const editUserDialogStyle = {
	textAlign: 'center',
}

var Users = React.createClass({
	getInitialState: function(){
		return{
			users: "",
		}
	},

	onChange: function(id, event) {
		if(id === 'email') {
			this.setState({
				emailFieldValue: event.target.value,
				// emailErrorText: ''
			});
		}
	},
	// handleClose is used to set state values to false in order to close dialogs
	handleClose: function(){
		this.setState({
			userToDelete: false,
			userToDeleteId: false,
			userToEdit: false,
			userToEditId: false,
		});
	},
	// _handleDelete is used to make an AJAX call to delete a user
	_handleDelete: function(userToDelete){

		fetch(`http://localhost:1337/api/users/`+ userToDelete, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.token,
			}
		})
		.then(response => {
			return fetch('http://localhost:1337/api/users', {
				method: 'GET',
				headers: {'Authorization': 'Bearer ' + localStorage.token}
			})
		})
		.then(function(response) {
			if (response.status >= 400) {
				throw new Error("Bad response from server");
			}
			return response.json();
		})
		.then(response => {
			this.setState({
				users: response,
				userToDelete: false,
				userToDeleteId: false
			});
		});
	},
	// _editUser is used to make an AJAX call to edit user information
	_editUser: function(userToEditId) {
		// Give the users the option to enter only desired fields by testing for empty values
		//Format the empty object for the server
		var currentUserInfo = {
			user_metadata: {}
		};

		// Set some variables from the form values for ternary simplicity later
		var firstName = this.refs.updatedFirstName.getValue()
		var lastName = this.refs.updatedLastName.getValue()
		var email = this.refs.updatedEmail.getValue()
		var password = this.refs.updatedPass.getValue()

		// If both first and last name are missing, delete the user_metadata
			// not doing this overrides all user_metadata on auth0
		firstName.length === 0 && lastName.length === 0 ? delete currentUserInfo.user_metadata : null;


		//If the field is empty, just null. Otherwise, add it to the object
		firstName.length !== 0 ? currentUserInfo.user_metadata.firstName = firstName : null;
		lastName.length !== 0 ? currentUserInfo.user_metadata.lastName = lastName : null;
		email.length !== 0 ? currentUserInfo.email = email : null;
		password.length !== 0 ? currentUserInfo.password = password : null;

		// Test to see if the email is formatted correctly, only if email has a string present set the error text
		var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!reg.test(this.state.emailFieldValue) && email.length > 0) {
			this.setState({emailErrorText: 'Email format should be "john@doe.com"'});
			return;
		}

		// this becomes that due to function scope
		var that = this;
		//Send the fetch Patch request
		fetch('http://localhost:1337/api/users/' + userToEditId, {
			method: 'PATCH',
			body: JSON.stringify(currentUserInfo),
			headers: {'Authorization': 'Bearer ' + localStorage.token, 'content-type': 'application/json'}
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
					return that._refreshData()
				}
			});

	},
	_refreshData: function(){
		// Due to a delay in auth0 when sending a PATCH, we must do two gets back to back
		//in order to retreive the updated user data
		fetch('http://localhost:1337/api/users', {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + localStorage.token}
			})
			.then(response1 => {
				if (response1.status >= 400) {
					throw new Error("Bad response from server");
				}
				return response1.json();
			})
			.then(response2 => {
				return fetch('http://localhost:1337/api/users', {
					method: 'GET',
					headers: {'Authorization': 'Bearer ' + localStorage.token}
				})
			})
			.then(response3 => {
				if (response3.status >= 400) {
					throw new Error("Bad response from server");
				}
				return response3.json();
			})
			.then(response4 =>{
				console.log(response4)
				this.setState({
					userToEdit: false,
					userToEditId: false,
					users: response4,
				})
			});

	},
	// renderData is used to render a list of employees
		// It it used in the map function on line 266 within the TableBody tag
	renderData: function(user) {
		return (
				<TableRow key={user.user_id}>
					<TableHeaderColumn>
						{/*Edit User button*/}
						<FlatButton
							onClick={() => this.setState({userToEdit: true, userToEditId: user.user_id})}
							icon={<FontIcon style={style.iconStyle} className="material-icons">{user.app_metadata.roles.indexOf('admin')<0 ? "create" : "face"}</FontIcon>}>
						</FlatButton>
					</TableHeaderColumn>
					<TableRowColumn>{user.user_metadata.firstName}</TableRowColumn>
					<TableRowColumn>{user.user_metadata.lastName}</TableRowColumn>
					<TableRowColumn>{user.email}</TableRowColumn>
					<TableRowColumn>
						{/*Delete button*/}
						<RaisedButton
							onTouchTap={()=>this.setState({userToDelete: user.user_metadata.firstName, userToDeleteId: user.user_id})}
							label="Delete"
							primary={true}
							disabled={user.app_metadata.roles.indexOf('admin')<0 ? false : true}
						/>
					</TableRowColumn>
				</TableRow>
		)
	},
	componentDidMount: function() {
		// Grab all the user information for the company
		fetch('http://localhost:1337/api/users', {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + localStorage.token}
		})
		.then(function(response) {
			if (response.status >= 400) {
            throw new Error("Bad response from server");
	        }
	        return response.json();
		})
		.then(response => {
			this.setState({users: response});
		})
	},
	render: function() {
		// When the page first loads, none of the states are set, this happens on componentDidMount
		// So, render a circular progress, swirl animation, to show the page loading to user
		//Once the component mounts, return the account information.
		if (this.state.users === '') {
			return (
				<div style={style.main}>
				<CircularProgress />
				</div>
			)
		}

		// Make a user variable for simplicity
		var users = this.state.users;

		// actionButtons are used in the delete dialog
			// cancel annules the operation
			// delete erases the selected user
		const actionsButtons = [
			<FlatButton
		    label="Cancel"
		    primary={true}
		    onTouchTap={this.handleClose}
		  />,
		  <FlatButton
		    label="Submit"
		    primary={true}
		    onClick={() => this._handleDelete(this.state.userToDeleteId)}
		  />,
		];

		// Return our mounted component once this.state.users has a value
	    return (
	      <div>
			    <h2>Accounts</h2>
			    <hr/>
				<Table>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				    <TableRow>
				    	<TableHeaderColumn></TableHeaderColumn>
				        <TableHeaderColumn>First Name</TableHeaderColumn>
				        <TableHeaderColumn>Last Name</TableHeaderColumn>
				        <TableHeaderColumn>Email</TableHeaderColumn>
				        <TableHeaderColumn>Action</TableHeaderColumn>
				    </TableRow>
				    </TableHeader>
				    <TableBody displayRowCheckbox={false}>
				    	{users.map(this.renderData)}
				    </TableBody>
		   	</Table>
		   		{/*Delete dialog that appears after pressing the delete button
		   			Used to delete a user except for the admin*/}
				<Dialog
		          	actions={actionsButtons}
		          	modal={false}
		          	open={this.state.userToDelete ? true:false}
		          	onRequestClose={this.handleClose}
			        >
			          Wait...Are you sure you want to delete {this.state.userToDelete}?
		        </Dialog>
		        {/*User to edit dialog
		        	Used to edit user information; email, password, firstname, and lastname*/}
				<Dialog
				    autoScrollBodyContent={true}
					modal={false}
					open={this.state.userToEdit ? true : false}
					onRequestClose={this.handleClose}
					>
					<div style={editUserDialogStyle}>
					<div>
						{/*The edit employee form*/}
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
								errorText={this.state.emailErrorText}
								onChange={this.onChange.bind(this, 'email')}
					    /><br />
					    <TextField
					      ref="updatedPass"
					      hintText="Updated Password"
					      floatingLabelText="Updated Password"
					      type="password"
					    /><br />
				    </div>
				    {/*Flatbutton to submit the edit user/employee form*/}
				    <FlatButton
				    	onClick={() => this._editUser(this.state.userToEditId)}
				    	backgroundColor='#40C4FF'
				    	label="Submit"
				    	primary={true}
				    	style={{color: '#E1F5FE', margin: '12px'}}
				    />
						<p style={{color:'red'}}>{this.state.formErrorMessage}</p>
					</div>
				</div>
				</Dialog>
	      </div>
	      );
	  }
})

export default Users;
