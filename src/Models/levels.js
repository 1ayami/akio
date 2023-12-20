const mongoose = require('mongoose')

const BotLevels = new mongoose.Schema({
	userName: String,
	userID: String,
	level: Number,
	xp: Number,
})

module.exports = mongoose.model('akio-levels', BotLevels)
