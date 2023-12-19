const { AKIO } = require('../Structures/Bot')

module.exports = {
	name: 'ready',

	/**
	 * @param {AKIO} bot
	 */
	exe(bot) {
		console.log(`✅ Bot iniciado como ${bot.user.username}`)
	},
}
