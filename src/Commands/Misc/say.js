const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
	name: 'say',
	category: 'MISC',
	description: 'El bot repetirá lo que tu digas',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	usage: '<texto>',

	prefix_command: {
		aliases: ['decir'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		exe(bot, msg, args) {
			const texto = args.join(' ')

			if (!texto) {
				bot.errorEmbed({
					desc: 'Debes especificar un texto',
					target: msg,
				})

				return
			}

			msg.delete()
			msg.channel.send(texto)
		},
	},
	slash_command: {
		name: 'say',
		type: 1,
		description: 'El bot dirá lo que tu quieras',
		options: [
			{
				name: 'texto',
				type: ApplicationCommandOptionType.String,
				description: 'Texto que quieres que repita',
				required: true,
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		exe(bot, int) {
			const text = int.options.getString('texto')

			int.reply({ content: 'Listo!', ephemeral: true })
			int.channel.send(text)
		},
	},
}
