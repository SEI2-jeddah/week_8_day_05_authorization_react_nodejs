/*
  @instructor Name:  Ebere.
  @program : WDI 4 Riyadh
*/

const User = require('../models/User');
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const passport = require('passport');

// const passportHelper = require('../config/passport')

router.get('/', (request, response)=>{
  User.find()
  .then(users => {
   response.send({message : "usershome"})
  }).catch(err => {
   response.send({message : err})
  })
  
})


module.exports = router