const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')
const mega = require('megadb')
const muteDB = new mega.crearDB('mute-roles')

module.exports = {
	name: 'unmute',
	category: 'MODERATION',
	description: 'Desmutea a un miembro del servidor',
	bot_permises: ['ViewChannel', 'SendMessages', 'ManageGuild'],
	user_permises: ['ManageGuild'],
	usage: '<usuario>',

	prefix_command: {
		aliases: ['unm'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const member =
				msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

			if (!member) {
				bot.errorEmbed({
					desc: 'Debes especificar un usuario',
					target: msg
				})
				return
			}

			if (
				!msg.member.roles.highest.comparePositionTo(member.roles.highest) > 0
			) {
				bot.errorEmbed({
					desc: 'No puedes desmutear a un usuario con una jerarquía mayor o igual a la tuya',
					target: msg
				})
				return
			}

			if (
				!(
					member.roles.cache.find((r) => r.name == 'Muted') &&
					member.roles.cache.size == 2
				)
			) {
				bot.errorEmbed({
					desc: 'Este usuario no está muteado',
					target: msg
				})
				return
			}

			const memberRoles = await muteDB.get(member.user.id)

			member.roles.set(memberRoles.roles)

			muteDB.delete(member.user.id)

			bot.successEmbed({
				desc: `El miembro ${member} ha sido desmuteado correctamente`,
				target: msg
			})

			bot.successEmbed({
				desc: `Has sido desmuteado del servidor **${msg.guild.name}**`,
				target: member,
				type: 'send'
			})
		},
	},
	slash_command: {
		name: 'unmute',
		type: 1,
		description: 'Desmutea a un miembro del servidor',

		options: [
			{
				name: 'miembro',
				description: 'El miembro que se va a desmutear',
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const member = int.options.getMember('miembro')

			if (!member) {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Debes especificar un usuario`,
						}),
					],
				})
				return
			}

			if (
				!int.member.roles.highest.comparePositionTo(member.roles.highest) > 0
			) {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} No puedes desmutear a un usuario con una jerarquía mayor o igual a la tuya`,
						}),
					],
				})
				return
			}

			if (
				!(
					member.roles.cache.find((r) => r.name == 'Muted') &&
					member.roles.cache.size == 2
				)
			) {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Este usuario no está muteado`,
						}),
					],
				})
				return
			}

			const memberRoles = await muteDB.get(member.user.id)

			await member.roles.set(memberRoles.roles)

			muteDB.delete(member.user.id)

			int.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsSucessColor,
						description: `${bot.config.emojis.right} El miembro ${member} ha sido desmuteado correctamente`,
					}),
				],
			})

			member.user
				.send({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsDefaultColor,
							description: `${bot.config.emojis.right} Has sido desmuteado del servidor **${int.guild.name}**`,
						}),
					],
				})
				.catch((e) => {})
		},
	},
}
