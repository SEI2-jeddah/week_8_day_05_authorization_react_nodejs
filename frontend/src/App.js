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

  getGames = () =>{
    axios.get('/api/games', header)
    .then(response => {
      console.log(response.data)
      if(response.data.games.length > 0){
        
        let data = {...this.state}
        data.games = response.data.games

        this.setState(data)
      }
    })
    .catch()
  }

  submitHandler = (e) => {   
    axios.post('/api/games',{ name : this.state.gamename}, header)
      .then( response => {
        
          let data = {...this.state}
          data.games.push(response.data.game)

          this.setState(data)
      })
      .catch()
  }

  loginHandler = (e) => {
    axios.post('/api/auth/login',{ email: this.state.email, password: this.state.password})
    .then( response => {
      console.log(response.data)
      if(response.data.token){
        setToken(response.data.token)

        let data = {...this.state}
        data.user = response.data.user
        data.isAuthenticated = true
        data.hasError = false

        this.setState(data)

        this.getGames()
      }
      
    })
    .catch(err =>{
      let data = {...this.state}
        data.hasError = true
        this.setState(data)

    })
  }

  logout = () =>{
    logout()
    let data = {...this.state}
    data.isAuthenticated = false
    data.user = ""
    data.email = ""
    data.password = ""
    data.games = []

    this.setState(data)
  }
  registerHandler = (e) => {
    axios.post('/api/auth/',{})
    .then( response => {

    })
    .catch()
  }

  displayGames = ()=>{
    
    return this.state.games.map(game => 
      <li key={game._id} id={game._id}>{game.name}</li>
      )
  }

  
  render(){
    
    const showLogin = (!this.state.isAuthenticated) ? <Login change={this.changeHandler} login={this.loginHandler} /> : null

    const Logout = (this.state.isAuthenticated) ? <Button onClick={this.logout}>Logout</Button> : null

    const GameView = (this.state.isAuthenticated) ? <Row>
                                                      <Col md={6}>
                                                        <ShowGame games={this.state.games} />
                                                      </Col>

                                                      <Col md={6}>
                                                        <AddGame add={this.submitHandler} change={this.changeHandler} />
                                                      </Col>
                                                      
                                                    </Row> : null

    console.log(this.state)
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
