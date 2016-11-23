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
				emailErrorText: ''
			});
		}
	},

	handleClose: function(){
		this.setState({
			userToDelete: false,
			userToDeleteId: false,
			userToEdit: false,
			userToEditId: false,
		});
	},
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
	_editUser: function(userToEditId) {
		var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!reg.test(this.state.emailFieldValue)) {
			this.setState({emailErrorText: 'Email format should be "john@doe.com"'});
			return;
		}

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
	renderData: function(user) {
		return (
				<TableRow key={user.user_id}>
					<TableHeaderColumn>
						<FlatButton
							onClick={() => this.setState({userToEdit: true, userToEditId: user.user_id})}
							icon={<FontIcon style={style.iconStyle} className="material-icons">{user.app_metadata.roles.indexOf('admin')<0 ? "create" : "face"}</FontIcon>}>
						</FlatButton>
					</TableHeaderColumn>
					<TableRowColumn>{user.user_metadata.firstName}</TableRowColumn>
					<TableRowColumn>{user.user_metadata.lastName}</TableRowColumn>
					<TableRowColumn>{user.email}</TableRowColumn>
					<TableRowColumn>
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
		if (this.state.users === '') {
			return (
				<div style={style.main}>
				<CircularProgress />
				</div>
			)
		}

		var users = this.state.users;

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
				<Dialog
		          	actions={actionsButtons}
		          	modal={false}
		          	open={this.state.userToDelete ? true:false}
		          	onRequestClose={this.handleClose}
			        >
			          Wait...Are you sure you want to delete {this.state.userToDelete}?
		        </Dialog>
				<Dialog
				    autoScrollBodyContent={true}
					modal={false}
					open={this.state.userToEdit ? true : false}
					onRequestClose={this.handleClose}
					>
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
