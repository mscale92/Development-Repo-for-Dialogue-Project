import React from 'react';

var WelcomePage = React.createClass({
	render: function() {
		return(
			<div>
				{this.props.children}
			</div>
		);
	}
});

export default WelcomePage;