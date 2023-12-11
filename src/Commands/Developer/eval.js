const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	EmbedBuilder,
} = require('discord.js')
const util = require('util')
const beautify = require('beautify')

module.exports = {
	name: 'evaluar',
	category: 'DEVELOPER',
	description: '',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	usage: '<code>',

	prefix_command: {
		aliases: ['eval'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const codeInput = args.join(' ')

			if (!codeInput) {
				bot.errorEmbed({
					desc: 'Debes ingresar un codigo a evaluar',
					target: msg,
				})

				return
			}

			try {
				let evaluated = eval(codeInput)

				const evaledEmbed = new EmbedBuilder()
					.setColor(bot.config.colors.success)
					.setAuthor({
						name: `Evaluación echa!`,
						iconURL: bot.user.displayAvatarURL(),
					})
					.addFields([
						{
							name: 'Tipo:',
							value: `\`\`\`prolog\n${typeof evaluated}\`\`\``,
							inline: true,
						},
						{
							name: 'Evaluado en:',
							value: `\`\`\`yaml\n${Date.now() - msg.createdTimestamp}ms\`\`\``,
							inline: true,
						},
						{
							name: 'Entrada:',
							value: '```js\n' + beautify(codeInput, { format: 'js' }) + '```',
							inline: true,
						},
						{
							name: 'Salida:',
							value: `\`\`\`js\n${util.inspect(evaluated, { depht: 0 })}\`\`\``,
							inline: true,
						},
					])

				msg.reply({ embeds: [evaledEmbed] })
			} catch (error) {
				const errorEmbed = new EmbedBuilder()
					.setColor(bot.config.colors.error)
					.setAuthor({
						name: `Ha habido un error`,
						iconURL: bot.user.displayAvatarURL(),
					})
					.addFields([
						{
							name: 'Entrada:',
							value: '```js\n' + beautify(codeInput, { format: 'js' }) + '```',
						},
						{
							name: 'Error:',
							value: `\`\`\`js\n${error}\`\`\``,
						},
					])

				msg.reply({ embeds: [errorEmbed] })
			}
		},
	},
}
