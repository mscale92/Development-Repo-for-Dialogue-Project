import React from 'react';
import {browserHistory} from 'react-router';
import CompanyPage from './CompanyPage';

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
