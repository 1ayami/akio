const { User } = require('discord.js')
const { AKIO } = require('../Structures/Bot')

module.exports = {
	name: 'userUpdate',

	/**
	 *
	 * @param {AKIO} bot
	 * @param {User} oldUser
	 * @param {User} newUser
	 */
	async exe(bot, oldUser, newUser) {
		const users = ['962393458583146496', '1124757657723613194']

		if (!users.includes(oldUser.id)) return

		if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
			const newColorAvatar = await bot.getVibrantColor(
				newUser.displayAvatarURL({ extension: 'jpg' })
			)

			const guild = bot.guilds.cache.get('1072237774134071307')

			if (newUser.id == '1124757657723613194') {
				const role = guild.roles.cache.get('1072237774402502719')

				role.setColor(newColorAvatar)
			} else if (newUser.id == '962393458583146496') {
				const role = guild.roles.cache.get('1072237774402502725')

				role.setColor(newColorAvatar)
			}
		}
	},
}
