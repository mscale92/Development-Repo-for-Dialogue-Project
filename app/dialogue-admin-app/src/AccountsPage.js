//Screen for Accounts

import React from 'react';
import Users from './Users';
import {Link} from 'react-router';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const style = {
	position: 'fixed',
	bottom: 0,
	right: 0,
	margin: '1em'
}

var AccountsPage = React.createClass({
  render() {
    return (
    	<div >
    		<Users />
    		<div style={style}>
			    <Link to="/createnewaccount">
				    <FloatingActionButton secondary={true}>
				      <ContentAdd />
				    </FloatingActionButton>
			    </Link>
		    </div>
    	</div>

    );
  }
});

export default AccountsPage;
