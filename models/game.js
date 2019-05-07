const mongoose = require('mongoose')
const Schema = mongoose.Schema


const genreSchema = new Schema({
 name : String
})

const gameSchema = new Schema({
 name : String,
 genres : [genreSchema]
})

const Game = mongoose.model('Game', gameSchema)
module.exports = Game