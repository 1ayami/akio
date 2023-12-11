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
	ApplicationCommandOptionType,
} = require('discord.js')
const axios = require('axios')

module.exports = {
	name: 'avatar',
	category: 'MISC',
	description: 'Muestra tu avatar o el de otro usuario',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	usage: '[usuario]',

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

			const avatarEmbed = new EmbedBuilder()

			const userIDRegex = new RegExp(/^([0-9]{17,20})$/)

			if (typeof member == 'string') {
				if (!userIDRegex.test(member)) {
					bot.errorEmbed({
						desc: 'La ID que ingresaste es inválida',
						target: msg,
					})
					return
				}

				const userData = await axios.get(
					`https://japi.rest/discord/v1/user/${member}`
				)

				const avatarHash = userData.data.data.avatar

				if (!avatarHash) {
					bot.errorEmbed({
						desc: 'El usuario especificado no tiene una foto de perfil',
						target: msg,
					})
					return
				}

				const avatarExtension = avatarHash.startsWith('a_') ? 'gif' : 'png'

				const userPFP = `https://cdn.discordapp.com/avatars/${member}/${avatarHash}.${avatarExtension}?size=4096`

				avatarEmbed
					.setTitle(`☂ Avatar de ${userData.data.data.global_name}`)
					.setImage(userPFP)
					.setColor(
						await bot.getVibrantColor(
							`https://cdn.discordapp.com/avatars/${member}/${avatarHash}.jpg?size=4096`
						)
					)

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
				.setTitle(`☂ Avatar de ${member.user.displayName}`)
				.setImage(member.user.displayAvatarURL({ size: 4096 }))
				.setColor(
					await bot.getVibrantColor(
						member.user.displayAvatarURL({ size: 4096, extension: 'jpg' })
					)
				)

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
		type: 1,
		description: 'Muestra tu avatar o el de otro usuario',
		options: [
			{
				type: ApplicationCommandOptionType.User,
				name: 'miembro',
				description: 'Usuario del que se quiere ver el avatar',
			},
			{
				type: ApplicationCommandOptionType.String,
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
			 * @type { GuildMember | string}
			 */
			const member =
				int.options.getMember('miembro') ||
				int.options.getString('id') ||
				int.member

			const avatarEmbed = new EmbedBuilder()

			const userIDRegex = new RegExp(/^([0-9]{17,20})$/)

			if (typeof member == 'string') {
				if (!userIDRegex.test(member)) {
					bot.errorEmbed({
						desc: 'La ID que ingresaste es inválida',
						target: int,
					})
					return
				}

				const userData = await axios.get(
					`https://japi.rest/discord/v1/user/${member}`
				)

				const avatarHash = userData.data.data.avatar

				if (!avatarHash) {
					bot.errorEmbed({
						desc: 'El usuario especificado no tiene una foto de perfil',
						target: int,
					})
					return
				}

				const avatarExtension = avatarHash.startsWith('a_') ? 'gif' : 'png'

				const userPFP = `https://cdn.discordapp.com/avatars/${member}/${avatarHash}.${avatarExtension}?size=4096`

				avatarEmbed
					.setTitle(`☂ Avatar de ${userData.data.data.global_name}`)
					.setImage(userPFP)
					.setColor(
						await bot.getVibrantColor(
							`https://cdn.discordapp.com/avatars/${member}/${avatarHash}.jpg?size=4096`
						)
					)

				const avatarButton = new ButtonBuilder()
					.setURL(userPFP)
					.setLabel('💙 Ver avatar')
					.setStyle(ButtonStyle.Link)

				const row = new ActionRowBuilder().addComponents(avatarButton)

				int.reply({ embeds: [avatarEmbed], components: [row] })
				return
			}

			avatarEmbed
				.setTitle(`☂ Avatar de ${member.user.displayName}`)
				.setImage(member.user.displayAvatarURL({ size: 4096 }))
				.setColor(
					await bot.getVibrantColor(
						member.user.displayAvatarURL({ size: 4096, extension: 'jpg' })
					)
				)

			const avatarButton = new ButtonBuilder()
				.setURL(member.user.displayAvatarURL({ size: 4096 }))
				.setLabel('💙 Ver avatar')
				.setStyle(ButtonStyle.Link)

			const row = new ActionRowBuilder().addComponents(avatarButton)

			int.reply({ embeds: [avatarEmbed], components: [row] })
		},
	},
}
