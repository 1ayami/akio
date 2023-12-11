const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
	name: 'ban',
	category: 'MODERATION',
	description: 'Banea a un miembro del servidor',
	bot_permises: ['ViewChannel', 'SendMessages', 'BanMembers'],
	user_permises: ['BanMembers'],
	usage: '<usuario> [razón]',

	prefix_command: {
		aliases: ['b'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const member =
				msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
			const reason = args.slice(1).join(' ') || 'No se especificó una razón'

			if (!member) {
				bot.errorEmbed({
					desc: 'Debes ingresar un usuario para banear',
					target: msg,
				})
				return
			}

			if (member.user.id == msg.member.user.id) {
				bot.errorEmbed({
					desc: 'No te puedes banear a ti mismo',
					target: msg,
				})
				return
			}

			if (!member.bannable) {
				bot.errorEmbed({
					desc: 'No puedes banear a este usuario',
					target: msg,
				})
				return
			}

			if (
				!msg.member.roles.highest.comparePositionTo(member.roles.highest) > 0
			) {
				bot.errorEmbed({
					desc: 'No puedes banear a un usuario con una jerarquía mayor o igual a la tuya',
					target: msg,
				})
				return
			}

			member.timeout()

			await member.ban({ reason: reason })

			bot.successEmbed({
				desc: `El usuario **${member.user.username}** ha sido baneado correctamente\n\nRazón: \`\`\`${reason}\`\`\``,
				target: msg,
			})

			bot.simpleEmbed({
				desc: `🔨 Has sido baneado del servidor **${msg.guild.name}**\n\nRazón: \`\`\`${reason}\`\`\``,
				type: 'send',
				target: member.user,
			})
		},
	},
	slash_command: {
		name: 'ban',
		type: 1,
		description: 'Banea a un miembro del servidor',
		options: [
			{
				type: ApplicationCommandOptionType.User,
				name: 'member',
				description: 'Miembro que se va a banear',
				required: true,
			},
			{
				type: ApplicationCommandOptionType.String,
				name: 'razón',
				description: 'Razón del baneo',
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const member = int.options.getMember('member')
			const reason =
				int.options.getString('razón') || 'No se especificó una razón'

			if (int.user.id == member.user.id) {
				bot.errorEmbed({
					desc: 'No te puedes banear a ti mismo',
					target: int,
				})
				return
			}

			if (
				!int.member.roles.highest.comparePositionTo(member.roles.highest) > 0
			) {
				bot.errorEmbed({
					desc: 'No puedes banear a un usuario con una jerarquía mayor o igual a la tuya',
					target: int,
				})
				return
			}

			await member.ban({ reason: reason })

			bot.successEmbed({
				desc: `El usuario **${member.user.username}** ha sido baneado correctamente\n\nRazón: \`\`\`${reason}\`\`\``,
				target: int,
			})

			bot.simpleEmbed({
				desc: `🔨 Has sido baneado del servidor **${int.guild.name}**\n\nRazón: \`\`\`${reason}\`\`\``,
				type: 'send',
				target: member.user,
			})
		},
	},
}
