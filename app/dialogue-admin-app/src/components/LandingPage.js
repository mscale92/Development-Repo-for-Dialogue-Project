import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';



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
					<div>
						<hgroup style={{textAlign: 'center'}}>
							<img role='presentation' src={require('../img/logoWhite.png')}/>
							<p style={{color: "#FFFFFF", margin: '1em 0'}}>Your Always There Healthcare Team</p>
						</hgroup>
						<div style={{margin: '2em 0'}}>
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
					</div>
				</div>
		);
	}

});

export default LandingPage;