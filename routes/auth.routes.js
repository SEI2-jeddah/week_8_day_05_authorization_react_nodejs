/*
  @instructor Name:  Ebere.
  @program : WDI 4 Riyadh
*/

const User = require('../models/User');
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const passport = require('passport');

const passportHelper = require('../config/passport')


router.get('/', (request, response, next) => {
  //custom jwt authenticate
  passport.authenticate('jwt', {session: false}, (err, user, info)=>{
      console.log("got here")
      if(err){ return response.status(400).json({ message: err }) }

      if(info !== undefined){
        return response.json({ message: info.message })
      }else{
        User.find({})
        .then((user)=>{
          response.json({ user: user });
        })

      }

      
  })(request, response, next)

  
})



module.exports = router