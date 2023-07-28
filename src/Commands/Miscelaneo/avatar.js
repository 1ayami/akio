const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	GuildMember,
	User,
} = require('discord.js')
const axios = require('axios')

module.exports = {
	name: 'avatar',
	category: 'MISCELANEO',
	description: 'Muestra tu avatar o el de otro usuario',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	owner_only: true,

	prefix_command: {
		aliases: ['pfp', 'avt'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			/**
			 * @type { GuildMember || string }
			 */
			const member = msg.mentions.members.first() || args[0] || msg.member

			const avatarEmbed = new EmbedBuilder().setColor(
				bot.config.embedsErrorColor
			)

			const userIDRegex = new RegExp(/^([0-9]{17,20})$/)

			if (typeof member == 'string') {
				if (!userIDRegex.test(member)) {
					msg.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsErrorColor,
								description: `${bot.config.emojis.wrong} La ID que ingresaste es inválida`,
							}),
						],
					})
					return
				}

				const userData = await axios.get(
					`https://japi.rest/discord/v1/user/${member}`
				)

				const avatarHash = userData.data.data.avatar

				if (!avatarHash) {
					msg.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsErrorColor,
								description: `${bot.config.emojis.wrong} El usuario especificado no tiene una foto de perfil`,
							}),
						],
					})
					return
				}

				const avatarExtension = avatarHash.startsWith('a_') ? 'gif' : 'png'

				const userPFP = `https://cdn.discordapp.com/avatars/${member}/${avatarHash}.${avatarExtension}?size=4096`

				avatarEmbed
					.setTitle(`☂ Avatar de ${userData.data.data.username}`)
					.setImage(userPFP)

				const avatarButton = new ButtonBuilder()
					.setURL(userPFP)
					.setLabel('Ver avatar')
					.setStyle(ButtonStyle.Link)
					.setEmoji('💙')

				const row = new ActionRowBuilder().addComponents(avatarButton)

				msg.reply({ embeds: [avatarEmbed], components: [row] })
				return
			}

			avatarEmbed
				.setTitle(`☂ Avatar de ${member.user.username}`)
				.setImage(member.user.displayAvatarURL({ size: 4096 }))

			const avatarButton = new ButtonBuilder()
				.setURL(member.user.displayAvatarURL({ size: 4096 }))
				.setLabel('💙 Ver avatar')
				.setStyle(ButtonStyle.Link)

			const row = new ActionRowBuilder().addComponents(avatarButton)

			msg.reply({ embeds: [avatarEmbed], components: [row] })
		},
	},
	slash_command: {
		name: 'avatar',
		description: 'Muestra tu avatar o el de otro usuario',
		options: [
			{
				type: 6,
				name: 'miembro',
				description: 'Usuario del que se quiere ver el avatar',
			},
			{
				type: 3,
				name: 'id',
				description: 'ID del usuario del que se quiere ver el avatar',
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			/**
			 * @type { User | string}
			 */
			const member =
				int.options.getMember('miembro') ||
				int.options.getString('id') ||
				int.member

			const avatarEmbed = new EmbedBuilder().setColor(
				bot.config.embedsErrorColor
			)

			const userIDRegex = new RegExp(/^([0-9]{17,20})$/)

			if (typeof member == 'string') {
				if (!userIDRegex.test(member)) {
					int.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsErrorColor,
								description: `${bot.config.emojis.wrong} La ID que ingresaste es inválida`,
							}),
						],
					})
					return
				}

				const userData = await axios.get(
					`https://japi.rest/discord/v1/user/${member}`
				)

				const avatarHash = userData.data.data.avatar

				if (!avatarHash) {
					int.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsErrorColor,
								description: `${bot.config.emojis.wrong} El usuario especificado no tiene una foto de perfil`,
							}),
						],
					})
					return
				}

				const avatarExtension = avatarHash.startsWith('a_') ? 'gif' : 'png'

				const userPFP = `https://cdn.discordapp.com/avatars/${member}/${avatarHash}.${avatarExtension}?size=4096`

				avatarEmbed
					.setTitle(`☂ Avatar de ${userData.data.data.username}`)
					.setImage(userPFP)

				const avatarButton = new ButtonBuilder()
					.setURL(userPFP)
					.setLabel('💙 Ver avatar')
					.setStyle(ButtonStyle.Link)

				const row = new ActionRowBuilder().addComponents(avatarButton)

				int.reply({ embeds: [avatarEmbed], components: [row] })
				return
			}

			avatarEmbed
				.setTitle(`☂ Avatar de ${member.user.username}`)
				.setImage(member.user.displayAvatarURL({ size: 4096 }))

			const avatarButton = new ButtonBuilder()
				.setURL(member.user.displayAvatarURL({ size: 4096 }))
				.setLabel('💙 Ver avatar')
				.setStyle(ButtonStyle.Link)

			const row = new ActionRowBuilder().addComponents(avatarButton)

			int.reply({ embeds: [avatarEmbed], components: [row] })
		},
	},
}
