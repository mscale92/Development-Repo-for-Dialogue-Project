
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, ReactRouter, browserHistory} from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

//MUI theme provider and customized mui theme here
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiThemeable from 'material-ui/styles/muiThemeable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

//all the pages
import WelcomePage from './components/WelcomePage';
import LandingPage from './components/LandingPage';
import DashBoard from './components/DashBoard';
import CompanyPage from './components/CompanyPage';
import AccountsPage from './components/AccountsPage';
import PlansPage from './components/PlansPage';
import BillingPage from './components/BillingPage';


//all the forms 
import EditCompanyInfo from './components/EditCompanyInfo';
import EditPaymentCardInfo from './components/EditPaymentCardInfo';
import CreateNewAccountForm from './components/CreateNewAccountForm';
import SignUpForm from './components/SignUpForm';
import LogInForm from './components/LogInForm';

import './css/index.css';

//Routes
var routes = (
    <Router history={browserHistory}>				
		<Route path="/" component={WelcomePage}>
		 	<IndexRoute component={LandingPage}/>
		 	<Route path="signup" component={SignUpForm}/>
		 	<Route path="login" component={LogInForm}/>
			<Route component={CompanyPage}>
				<Route path="dashboard" component={DashBoard}/>
			  	<Route path="accounts" component={AccountsPage}/>
			  	<Route path="plans" component={PlansPage}/>
			  	<Route path="billing" component={BillingPage}/>
			  	<Route path="editcompany" component={EditCompanyInfo} />
			  	<Route path="editcard" component={EditPaymentCardInfo} />
			    <Route path="createnewaccount" component={CreateNewAccountForm} />
	    	</Route>

    	</Route>
    </Router>
);

//the following codes make customizations to the MUI default theme
const myMuiTheme = getMuiTheme({
	//changing the color of the appbar
	palette: {
    primary1Color: '#26bdf0',
  },

});

ReactDOM.render(
  <MuiThemeProvider muiTheme={myMuiTheme}>{routes}</MuiThemeProvider>,
  document.getElementById('root')
);
