//this will be the main layout
import React from 'react';
import {Link, browserHistory} from 'react-router';

import IconMenu from 'material-ui/IconMenu';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

const activeStyle = {
  borderBottom: '2px solid #FF4081'
}

var CompanyPage = React.createClass({
  getInitialState: function(){
    return ({})
  },
  handleChangeTask: function(event, value) {
    this.setState({valueTask: value,})
  },
  _handleLogout: function(){
    localStorage.removeItem('token');
    browserHistory.push('/');
  },
  _editCompany: function(){
    browserHistory.push('editcompany');
  },
  _editPayment: function(){
    browserHistory.push('editcard');
  },
  render: function() {

    var menu = (
      <div style={{display: 'flex'}}>
        <Link activeClassName="active" activeStyle={activeStyle} to="/dashboard">
          <FlatButton labelStyle={{color: 'white'}} label="Dashboard" />
        </Link>
        <Link activeClassName="active" activeStyle={activeStyle} to="/accounts">
          <FlatButton labelStyle={{color: 'white'}} label="Accounts" />
        </Link>
        <Link activeClassName="active" activeStyle={activeStyle} to="/plans">
          <FlatButton labelStyle={{color: 'white'}} label="Plans" />
        </Link>
        <Link activeClassName="active" activeStyle={activeStyle} to="/billing">
          <FlatButton labelStyle={{color: 'white'}} label="Billing" />
        </Link>
      </div>
    );

    var avatarMenu = (
      <IconMenu
        iconButtonElement={<Avatar style={{cursor: 'pointer'}} src="http://placekitten.com/g/100/100" />}
      >
        <MenuItem onClick={this._editCompany} primaryText="Edit Company"/>
        <MenuItem onClick={this._editPayment} primaryText="Edit Payment"/>
        <MenuItem onClick={this._handleLogout} primaryText="Logout"/>
      </IconMenu>
    );

    return (
      <div>
        <AppBar
          titleStyle={{display: 'none'}}
          iconStyleLeft={{flex: 1}}
          iconElementLeft={menu}
          iconElementRight={avatarMenu}
        />
        <div className="main-view">
          {this.props.children}
        </div>
      </div>
      );
  }
})

export default CompanyPage;





