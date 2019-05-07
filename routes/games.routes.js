/*
  @instructor Name:  Ebere.
  @program : WDI 4 Riyadh
*/

const Game = require('../models/game')

const router = require('express').Router()

router.get('/', (request, response)=>{
  Game.find({})
  .then(games => {
   if(games.length < 1){
    return response.json({ games : games, message : 'nothing found'})
   }
   response.status(200).json({ games : games})
  })
  .catch(err => {
   response.send({ message : err})
  })
  
})



router.post('/', (request, response)=>{

  let data = {
    name : request.body.name
  }

  let game = new Game(data)

  game.save()
  .then(()=> {
   
   response.status(200).json({ game : game, message: "saved"})
  })
  .catch(err => {
   response.send({ message : err})
  })
  
})


module.exports = router