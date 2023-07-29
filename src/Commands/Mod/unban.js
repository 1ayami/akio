const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
	name: 'unban',
	category: 'MODERATION',
	description: 'Desbanea a un usuario',
	bot_permises: ['ViewChannel', 'SendMessages', 'BanMembers'],
	user_permises: ['BanMembers'],

	prefix_command: {
		aliases: [],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const userId = args[0]
			const reason = args.slice(1).join(' ') || 'No se especificó una razón'

			const userIDRegex = new RegExp(/^([0-9]{17,20})$/)

			if (!userId || isNaN(userId) || !userIDRegex.test(userId)) {
				msg.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Ingresa una ID de usuario válida`,
						}),
					],
				})
				return
			}

			const bannedUser = msg.guild.bans.cache.get(userId)

			if (!bannedUser) {
				msg.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Este usuario no está baneado`,
						}),
					],
				})
				return
			}

			await msg.guild.members.ban(bannedUser.user, { reason: reason })
			msg.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsSucessColor,
						description: `${bot.config.emojis.right} El usuario ${bannedUser.user.username} ha sido desbaneado`,
					}),
				],
			})
		},
	},
	slash_command: {
		name: 'unban',
		type: 1,
		description: 'Desbanea a un usuario',
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'id',
				description: 'La ID del usuario a desbanear',
				required: true,
			},
			{
				type: ApplicationCommandOptionType.String,
				name: 'razón',
				description: 'La razón del desbaneo',
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const userId = int.options.getString('id')
			const reason = int.options.getString('razón')

			const userIDRegex = new RegExp(/^([0-9]{17,20})$/)

			if (isNaN(userId) || !userIDRegex.test(userId)) {
				msg.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Ingresa una ID de usuario válida`,
						}),
					],
				})
				return
			}

			const bannedUser = int.guild.bans.cache.get(userId)

			if (!bannedUser) {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Este usuario no está baneado`,
						}),
					],
				})
				return
			}

			await int.guild.members.unban(bannedUser)
			int.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsSucessColor,
						description: `${bot.config.emojis.right} El usuario ${bannedUser.user.username} ha sido desbaneado`,
					}),
				],
			})
		},
	},
}
