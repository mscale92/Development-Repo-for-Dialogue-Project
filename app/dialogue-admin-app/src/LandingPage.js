import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const center = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
    backgroundColor: '#26bdf0',
    height: '100vh',
	fontFamily: 'Roboto, sans-serif',
	color: 'white',
	textAlign: 'center',
}

var LandingPage = React.createClass({
	render: function() {
		return (
				<div style={center}>
					<hgroup>
						<img role='presentation' src={require('./logoWhite.png')}/>
						<p style={{margin: '0'}}>Your Always There Healthcare Team</p>
						<br/>
					</hgroup>
				    <FlatButton 
				    	href="./login"
				    	label="Log in" 
				    	backgroundColor="#FFFFFF"
				    	hoverColor="#81D4FA" 
				    	primary={true}
				    	style={{color: '#40C4FF', margin: '12'}}
				    	/>
				    <FlatButton 
				    	href="./signup"
					    label="Sign up" 
					    backgroundColor="#FFFFFF"
					    hoverColor="#81D4FA" 
					    primary={true}
				    	style={{color: '#40C4FF', margin: '12'}}
				    />
				</div>
		);
	}

});

export default LandingPage;