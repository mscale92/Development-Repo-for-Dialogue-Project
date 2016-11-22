import React from 'react';
import {browserHistory} from 'react-router';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import EditUserForm from './EditUserForm';

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

var Users = React.createClass({
	getInitialState: function(){
		return{
			users: "",
		}
	},
	handleClose: function(){
		//TODO userToEditId
		this.setState({
			userToDelete: false,
			userToDeleteId: false,
			userToEdit: false,

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
	renderData: function(user) {
		return (
				<TableRow key={user.user_id}>
					<TableHeaderColumn>
						<FlatButton onClick={() => this.setState({userToEdit: true})} icon={<FontIcon style={style.iconStyle} className="material-icons">{user.app_metadata.roles.indexOf('admin')<0 ? "create" : "face"}</FontIcon>}></FlatButton>
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
							open={this.state.userToEdit ? true:false}
							onRequestClose={this.handleClose}
						>
							<EditUserForm/>
						</Dialog>
	      </div>
	      );
	  }
})

export default Users;