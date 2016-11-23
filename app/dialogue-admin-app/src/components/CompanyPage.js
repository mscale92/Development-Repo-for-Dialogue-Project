//this will be the main layout
import React from 'react';
import {Link, browserHistory} from 'react-router';

import IconMenu from 'material-ui/IconMenu';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';


function _getPicture(currentUser){
  return fetch(`http://localhost:1337/api/users/`+ currentUser, {
   method: 'GET',
   headers: {
     'Authorization': 'Bearer ' + localStorage.token,
   }
  })
  .then(response => {
   return response.json();
  })
  .then(response => {
    return response;
  })
}



const activeStyle = {
  borderBottom: '2px solid #FF4081'
}

var CompanyPage = React.createClass({
  getInitialState: function(){
    return ({
      user: {
        "picture": ""
      }
    })
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
      var user = response[0].user_id;
      return user;
    })
    .then(user =>{
      return _getPicture(user)
    })
    .then(currentUser => {
      this.setState({user: currentUser});
    })
  },
  _avatar: function(user){
    var avatar = "";
    if(!user.user_metadata){
        avatar = user.picture;
    }
    else{
      if(!user.user_metadata.picture){
        avatar = user.picture;
      }
      else{
        avatar = user.user_metadata.picture;
      }
    }

    return(
      <div style={{display: "flex", "alignItems": "center"}}>
        <h3 style={{color: "white", margin: 0, "marginRight": "1em"}}>Welcome {user.user_metadata ? user.user_metadata.firstName : ""}</h3>
        <IconMenu iconButtonElement={<Avatar style={{cursor: 'pointer'}} src={avatar} />} >
          <MenuItem onClick={this._editCompany} primaryText="Edit Company"/>
          <MenuItem onClick={this._editPayment} primaryText="Edit Payment"/>
          <MenuItem onClick={this._handleLogout} primaryText="Logout"/>
        </IconMenu>
      </div>

      )
  },
  render: function() {

    var user = this.state.user;

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

    var avatarMenu = this._avatar(user)

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
