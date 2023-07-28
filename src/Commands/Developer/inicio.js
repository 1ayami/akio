const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
} = require('discord.js')

module.exports = {
	name: 'inicio',
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
			const menuInicio = new StringSelectMenuBuilder()
				.setCustomId('menu-inicio')
				.setPlaceholder('Selecciona una opción')
				.addOptions([
					{
						label: 'Leer las normas',
						emoji: '📘',
						description: 'Será mejor que lo hagas',
						value: 'normas-op',
					},
					{
						label: '¿De qué trata el server?',
						emoji: '❓',
						description: '¿Y este server para que es?',
						value: 'server-op',
					},
					{
						label: 'Abrir ticket',
						emoji: '🎫',
						description: 'Accede al soporte del servidor',
						value: 'ticket-op',
					},
				])

			const row = new ActionRowBuilder().addComponents(menuInicio)

			const imageEmbed = new EmbedBuilder()
				.setColor(bot.config.embedsDefaultColor)
				.setImage('https://i.imgur.com/f913SBE.jpeg')

			const panelEmbed = new EmbedBuilder()
				.setColor(bot.config.embedsDefaultColor)
				.setThumbnail(msg.guild.iconURL({ size: 4096 }))
				.setTitle(
					`> Servidor ${msg.guild.name} <a:bluecat:1129906209332396073>`
				)
				.setDescription(
					`Bienvenid@ a **[Genesis](https://discord.gg/Kt6TV3CXAm)**!\n\nSi necesitas **ayuda**, quieres conocer de que trata el **servidor** o desesas leer las **normas**, puedes seleccionar la opción correspondiente en este panel.\n\n**Pasatela muy bien!**`
				)
				.setImage('https://i.imgur.com/oHhSW78.png')

			msg.channel.send({ embeds: [imageEmbed, panelEmbed], components: [row] })
		},
	},
}
