const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
	name: 'unlock',
	category: 'MODERATION',
	description:
		'Desbloquea un canal para que los usuarios puedan escribir en él nuevamente',
	bot_permises: ['ViewChannel', 'SendMessages', 'ManageChannels'],
	user_permises: ['ManageChannels'],
	usage: '[canal]',

	prefix_command: {
		aliases: ['desbloquear'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		exe(bot, msg, args) {
			const ch =
				msg.mentions.channels.first() ||
				msg.guild.channels.cache.get(args[0]) ||
				msg.channel

			const everyone = msg.guild.roles.everyone

			if (!ch) {
				bot.errorEmbed({
					desc: 'Debes especificar un canal para desbloquear',
					target: msg,
				})
				return
			}

			if (ch.permissionsFor(everyone).has('SendMessages')) {
				bot.errorEmbed({
					desc: `El canal ${ch} ya está desbloqueado`,
					target: msg,
				})
				return
			}

			ch.edit({
				permissionOverwrites: [
					{
						id: everyone,
						allow: ['SendMessages'],
					},
				],
			})

			bot.successEmbed({
				desc: `🔓 El canal ${ch} está desbloqueado`,
				target: msg,
			})

			if (ch.id !== msg.channel.id) {
				ch.send({
					embeds: [
						bot.simpleEmbed({
							desc: `🔓 ${bot.config.emojis.right} Este canal ha sido desbloqueado`,
							send: false,
						}),
					],
				})
			}
		},
	},
	slash_command: {
		name: 'unlock',
		type: 1,
		description:
			'Desbloquea un canal para que los usuarios puedan escribir en él nuevamente',
		options: [
			{
				type: ApplicationCommandOptionType.Channel,
				name: 'canal',
				description: 'El canal que se va a desbloquear',
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		exe(bot, int) {
			const ch = int.options.getChannel('canal') || int.channel

			const everyone = int.guild.roles.cache.find((r) => r.name == '@everyone')

			if (!ch) {
				bot.errorEmbed({
					desc: 'Debes especificar un canal para desbloquear',
					target: int,
				})
				return
			}

			if (ch.permissionsFor(everyone).has('SendMessages')) {
				bot.errorEmbed({
					desc: `El canal ${ch} ya está desbloqueado`,
					target: int,
				})
				return
			}

			ch.edit({
				permissionOverwrites: [
					{
						id: everyone,
						allow: ['SendMessages'],
					},
				],
			})

			bot.successEmbed({
				desc: `🔓 El canal ${ch} está desbloqueado`,
			})

			if (ch.id !== int.channel.id) {
				ch.send({
					embeds: [
						bot.simpleEmbed({
							desc: `🔓 ${bot.config.emojis.right} Este canal ha sido desbloqueado`,
							send: false,
						}),
					],
				})
			}
		},
	},
}
