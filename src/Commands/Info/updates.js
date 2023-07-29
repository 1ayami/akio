const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	EmbedBuilder,
} = require('discord.js')

module.exports = {
	name: 'updates',
	category: 'INFORMATION',
	description: 'Donde puedes ver las actualizaciones del bot',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],

	prefix_command: {
		aliases: [],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		exe(bot, msg, args) {
			const embed = new EmbedBuilder()
				.setColor(bot.config.embedsDefaultColor)
				.setAuthor({
					iconURL: bot.user.displayAvatarURL(),
					name: bot.user.username,
				})
				.setDescription(
					`Puedes ver las actualizaciones en el canal <#1072240652517113926> o en el **[repositorio de GitHub](https://github.com/1ayami/akio)**`
				)

			msg.reply({ embeds: [embed] })
		},
	},
	slash_command: {
		name: 'updates',
		type: 1,
		description: 'Donde puedes ver las actualizaciones del bot',
		options: [],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		exe(bot, int) {
			const embed = new EmbedBuilder()
				.setColor(bot.config.embedsDefaultColor)
				.setAuthor({
					iconURL: bot.user.displayAvatarURL(),
					name: bot.user.username,
				})
				.setDescription(
					`Puedes ver las actualizaciones en el canal <#1072240652517113926> o en el **[repositorio de GitHub](https://github.com/1ayami/akio)**`
				)

			int.reply({ embeds: [embed] })
		},
	},
}
