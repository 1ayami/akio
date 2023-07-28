const { AKIO } = require('../../Structures/Bot')
const { Message, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
	name: 'emit-wlc',
	category: 'DEVELOPER',
	description: '',
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
			bot.emit('guildMemberAdd', msg.member)
		},
	},
}
