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
	usage: '<usuario> [razón]',

	prefix_command: {
		aliases: [],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			await msg.guild.bans.fetch()

			const userId = args[0]
			const reason = args.slice(1).join(' ') || 'No se especificó una razón'

			const bannedUser =
				msg.guild.bans.cache.get(userId) ||
				msg.guild.bans.cache.find((u) => u.user.username == userId)

			if (!bannedUser) {
				bot.errorEmbed({
					desc: 'Este usuario no está baneado o no se encontró en la lista',
					target: msg,
				})
				return
			}

			await msg.guild.members.unban(bannedUser.user, { reason: reason })

			bot.successEmbed({
				desc: `🔨 El usuario **${bannedUser.user.username}** ha sido desbaneado`,
				target: msg,
			})

			bot.simpleEmbed({
				desc: `🔨 Has sido desbaneado del servidor **${msg.guild.name}**`,
				target: bannedUser.user,
				type: 'send',
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

			await int.guild.bans.fetch()

			const bannedUser =
				int.guild.bans.cache.get(userId) ||
				int.guild.bans.cache.find((u) => u.user.username == userId)

			if (!bannedUser) {
				bot.errorEmbed({
					desc: 'Este usuario no está baneado o no se encontró en la lista',
					target: int,
				})
				return
			}

			await int.guild.members.unban(bannedUser.user, { reason: reason })

			bot.successEmbed({
				desc: `El usuario **${bannedUser.user.username}** ha sido desbaneado`,
				target: int,
			})

			bot.simpleEmbed({
				desc: `🔨 Has sido desbaneado del servidor **${int.guild.name}**`,
				target: bannedUser.user,
				type: 'send',
			})
		},
	},
}
