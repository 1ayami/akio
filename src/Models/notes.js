const mongoose = require('mongoose')

const BotNotes = new mongoose.Schema({
	userName: String,
	userID: String,
	notes: [{ title: String, note: String }],
})

module.exports = mongoose.model('akio-notes', BotNotes)
