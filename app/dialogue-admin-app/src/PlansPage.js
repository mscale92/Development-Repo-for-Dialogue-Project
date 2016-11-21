//Screen for Plans

import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

//the style below styles the progressing icon
const style = {
	display: 'flex',
	justifyContent: 'center',
	alignItem: 'center',
	height: '100vh',
	marginTop: '30vh'
}

const currentPlanIconStyle = {
	color: 'white',
	paddingTop: '3px'
}

var PlansPage = React.createClass({
	getInitialState: function() {
		return {}
	},
	componentDidMount: function() {
		console.log('component mounted');
		//Gets the data from all plans
		fetch('http://localhost:1337/api/plans', {
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
			this.setState({getData: response.data})
		})
		//Gets the company's current plan
		fetch('http://localhost:1337/api/currentplan', {
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
			this.setState({getCurrentPlan: response.plan})
		})	
	},
	_handleUpdate: function() {

		var that = this;
		fetch('http://localhost:1337/api/currentplan', {
			method: 'PUT',
			body: JSON.stringify({planToUpdate: this.state.updateToThis}),
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
				that.setState({
					getCurrentPlan: response,
					updateToThis: false
				});
			}
			console.log(response);
		})
	},
	handleClose: function(){
		this.setState({updateToThis: false})
	},
    renderData: function(data) {
  	return (
		<Paper style={{margin: '0.5em'}} zDepth={2} >
			<div style={{padding: '1em'}}>
			<h3>{data.name}</h3>
			{/*we will hard code description*/}
			<p>hardcoded description</p>
			{/*the raw data we receive from Stripe api is in cents*/}
			<h4>$CAD {data.amount/100} /User/Month</h4>
		{/*the label below has to reflect the current plan of the company*/}
			<RaisedButton
				//add an  function{this.styleButtonAfterUpdate(data.id)}
			 	label = {data.id===this.state.getCurrentPlan.id ? <FontIcon style={currentPlanIconStyle} className="material-icons">check</FontIcon> : 'Update'}
				disabled = {data.id===this.state.getCurrentPlan.id ? true : false}
				fullWidth={true}
				secondary={true}
				onTouchTap={() => this.setState({updateToThis: data.id})}
			/>
			</div>
			</Paper>
		)
    },
    render() {
		if (!this.state.getData) {
			return (<div style={style}><CircularProgress /></div>)
		}
		var plans = this.state.getData;

		{/*the function handleupdate triggers the updateplan function; the value of the plan is hold inside of the state updateToThis this.state.updateToThis */}
    	const actionsButtons = [
			<FlatButton
		    label="Cancel"
		    primary={true}
		    onTouchTap={this.handleClose}
		  />,
		  <FlatButton
		    label="Update"
		    primary={true}
		    onTouchTap={this._handleUpdate}
		  />
		];
	    return (
	    	<div>
	        <h2>Plan Options</h2>

    		<div style={{display: 'flex'}}>
    			{plans.map(this.renderData)}
    			
	    			<Dialog
				          actions={actionsButtons}
				          modal={false}
				          open={this.state.updateToThis ? true:false}
				          onRequestClose={this.handleClose}
				        >
				          Are you sure to update to {this.state.updateToThis} plan?
			        </Dialog>
  			</div>
  			</div>


	    );
	  }
});

export default PlansPage;
