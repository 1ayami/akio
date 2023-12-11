const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')
const mega = require('megadb')
const muteDB = new mega.crearDB('mute-roles')

module.exports = {
	name: 'mute',
	category: 'MODERATION',
	description: 'Silencia a un miembro del servidor',
	bot_permises: ['ViewChannel', 'SendMessages', 'ManageGuild'],
	user_permises: ['ManageGuild'],
	usage: '<usuario>',

	prefix_command: {
		aliases: ['m'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		exe(bot, msg, args) {
			const member =
				msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
			const reason = args.slice(1).join(' ') || 'No se especificó una razón'
			const muteRole = msg.guild.roles.cache.get('1135023793098735677')

			if (!member) {
				bot.errorEmbed({
					desc: 'Debes especificar un usuario',
					target: msg,
				})
				return
			}

			if (member.user.bot) {
				bot.errorEmbed({
					desc: 'No puedes mutear a un bot',
					target: msg,
				})
				return
			}

			if (
				!msg.member.roles.highest.comparePositionTo(member.roles.highest) > 0
			) {
				bot.errorEmbed({
					desc: 'No puedes mutear a un usuario con una jerarquía mayor o igual a la tuya',
					target: msg,
				})
				return
			}

			if (
				member.roles.cache.size == 2 &&
				member.roles.cache.find((r) => r.name == 'Muted')
			) {
				bot.errorEmbed({
					desc: 'Este usuario ya está muteado',
					target: msg,
				})
				return
			}

			muteDB.set(member.user.id, {
				name: member.user.username,
				roles: Array.from(member.roles.cache.values()).map((r) => r.id),
			})
			member.roles.set([muteRole])

			bot.successEmbed({
				desc: `El miembro ${member} ha sido muteado\n\nRazón:\`\`\`${reason}\`\`\``,
				target: msg,
			})

			bot.simpleEmbed({
				desc: `🔈 Has sido muteado del servidor **${msg.guild.name}**\nRazón:\`\`\`${reason}\`\`\``,
				type: 'send',
				target: member.user,
			})
		},
	},
	slash_command: {
		name: 'mute',
		type: 1,
		description: 'Silencia a un miembro del servidor',
		options: [
			{
				type: ApplicationCommandOptionType.User,
				name: 'miembro',
				description: 'Miembro a mutear',
				required: true,
			},
			{
				type: ApplicationCommandOptionType.String,
				name: 'razón',
				description: 'Razón del muteo',
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		exe(bot, int) {
			const member = int.options.getMember('miembro')
			const reason =
				int.options.getString('razón') || 'No se especificó una razón'
			const muteRole = int.guild.roles.cache.get('1135023793098735677')

			if (member.user.bot) {
				bot.errorEmbed({
					desc: 'No puedes mutear a un bot',
					target: int,
				})
				return
			}

			if (
				!int.member.roles.highest.comparePositionTo(member.roles.highest) > 0
			) {
				bot.errorEmbed({
					desc: 'No puedes mutear a un usuario con una jerarquía mayor o igual a la tuya',
					target: int,
				})
				return
			}

			if (
				member.roles.cache.size == 2 &&
				member.roles.cache.find((r) => r.name == 'Muted')
			) {
				bot.errorEmbed({
					desc: 'Este usuario ya está muteado',
					target: int,
				})
				return
			}

			muteDB.set(member.user.id, {
				name: member.user.username,
				roles: Array.from(member.roles.cache.values()).map((r) => r.id),
			})
			member.roles.set([muteRole])

			bot.successEmbed({
				desc: `El miembro ${member} ha sido muteado\n\nRazón:\`\`\`${reason}\`\`\``,
				target: int,
			})

			bot.simpleEmbed({
				desc: `🔈 Has sido muteado del servidor **${int.guild.name}**\nRazón:\`\`\`${reason}\`\`\``,
				type: 'send',
				target: member.user,
			})
		},
	},
}
