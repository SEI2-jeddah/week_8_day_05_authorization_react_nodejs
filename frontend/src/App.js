import React, {Component} from 'react';
import axios from 'axios'
import { getToken, setToken, logout} from './services/auth'
import Login from './components/Login';

import {Container, Row, Button, Col, Alert} from 'reactstrap';
import ShowGame from './components/ShowGame';
import AddGame from './components/AddGame';


let header = {
  headers :{
    "Content-Type" : "application/json",
    "Authorization" : `Bearer ${getToken()}`
  }
}

class App extends Component {

  state = {
    games : [],
    user : "",
    errorMsg : '',
    isAuthenticated : false,
    hasError : false
  }

  changeHandler = (e) => {
    let data = {...this.state}
    data[e.target.name] = e.target.value

    this.setState(data)
  }

  
  
  render(){
    
    return (
      <Container>
        <Alert color="danger" isOpen={this.state.hasError} toggle={this.onDismiss} fade={false}>{this.state.errorMsg}</Alert>
        
        Username: {this.state.user.username}
        {Logout}
      
        {showLogin}
        {GameView}
      </Container>
    );
  }
}

export default App;
