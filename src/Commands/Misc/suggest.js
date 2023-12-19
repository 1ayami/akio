const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
	name: 'suggest',
	category: 'MISC',
	description: 'Realiza una sugerencia para mejorar el servidor',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	usage: '<sugerencia>',
	cooldown: 1000 * 600,

	prefix_command: {
		aliases: ['sug', 'sugerir'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const sug = args.join(' ')
			const ch = msg.guild.channels.cache.get('1072240622582366238')

			if (!sug) {
				bot.errorEmbed({
					desc: 'Debes ingresar una sugerencia',
					target: msg,
				})
				return
			}

			const embedSug = new EmbedBuilder()
				.setColor(bot.config.colors.normal)
				.setTitle('> Nueva sugerencia <a:penguin_process:874377421128888370>')
				.addFields([
					{
						name: '<:member:1129903183850917978> Usuario',
						value: `ID: \`${msg.author.id}\` | user: \`${msg.author.tag}\``,
					},
					{
						name: '<:purplearrow:1129823325170958457> Sugerencia',
						value: sug,
					},
				])
				.setThumbnail(msg.author.displayAvatarURL())

			const ms = await ch.send({ embeds: [embedSug] })

			await bot.successEmbed({
				desc: 'Tu sugerencia fue enviada correctamente',
				target: msg.channel,
				type: 'send',
			})

			await ms.react(bot.config.emojis.right)
			await ms.react('❓')
			await ms.react(bot.config.emojis.wrong)
		},
	},
	slash_command: {
		name: 'suggest',
		type: 1,
		description: 'Realiza una sugerencia para mejorar el servidor',
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'sugerencia',
				description: 'Tu sugerencia',
				required: true,
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const sug = int.options.getString('sugerencia')
			const ch = int.guild.channels.cache.get('1072240622582366238')

			const e = await int.deferReply()

			const embedSug = new EmbedBuilder()
				.setColor(bot.config.colors.normal)
				.setTitle('> Nueva sugerencia <a:penguin_process:874377421128888370>')
				.addFields([
					{
						name: '<:member:1129903183850917978> Usuario',
						value: `ID: \`${int.user.id}\` | user: \`${int.user.tag}\``,
					},
					{
						name: '<:purplearrow:1129823325170958457> Sugerencia',
						value: sug,
					},
				])
				.setThumbnail(int.user.displayAvatarURL())

			const ms = await ch.send({ embeds: [embedSug] })

			await e.edit({
				embeds: [
					bot.successEmbed({
						desc: 'Tu sugerencia fue enviada correctamente',
						send: false,
					}),
				],
			})

			await ms.react(bot.config.emojis.right)
			await ms.react('❓')
			await ms.react(bot.config.emojis.wrong)
		},
	},
}
