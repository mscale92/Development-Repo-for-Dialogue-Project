import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const style = {

	display: 'flex',
	justifyContent: 'center',
	alignItem: 'center',
	height: '100vh',
	marginTop: '30vh'
}

var Users = React.createClass({
	getInitialState: function(){
		return{
			users: "",
		}
	},
	handleClose: function(){
		this.setState({userToDelete: false})
	},
	renderData: function(user) {
		return (

				<TableRow key={user.user_id}>
					<TableRowColumn>{user.user_metadata.firstName}</TableRowColumn>
					<TableRowColumn>{user.user_metadata.lastName}</TableRowColumn>
					<TableRowColumn>{user.email}</TableRowColumn>
					<TableRowColumn>
						<RaisedButton
							onTouchTap={()=>this.setState({userToDelete: user.user_metadata.firstName, userIdtoDelete: user.user_id})}
							label="Delete"
							primary={true}/>
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
				<div style={style}>
				<CircularProgress /></div>
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
		    onTouchTap={() => alert('userId is ' + this.state.userIdtoDelete + '!')}
		  />,
		];
	    return (
	      <div>
			    <h2>Accounts</h2>
			    <hr/>
				<Table>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				    <TableRow>
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
			          open={!this.state.userToDelete ? false:true}
			          onRequestClose={this.handleClose}
			        >
			          Wait...Are you sure you want to delete {this.state.userToDelete}?
		        </Dialog>
	      </div>
	      );
	  }
})

export default Users;
