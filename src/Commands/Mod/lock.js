const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	ChannelType,
} = require('discord.js')

module.exports = {
	name: 'lock',
	category: 'MODERATION',
	description: 'Bloquea un canal para que ningún usuario pueda escribir en él',
	bot_permises: ['ViewChannel', 'SendMessages', 'ManageChannels'],
	user_permises: ['ManageChannels'],
	usage: '[canal]',

	prefix_command: {
		aliases: ['bloquear'],

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

			const everyone = msg.guild.roles.cache.find((r) => r.name == '@everyone')

			if (!ch) {
				bot.errorEmbed({
					desc: 'Debes especificar un canal para bloquear',
					target: msg,
				})
				return
			}

			if (ch.type !== ChannelType.GuildText) {
				bot.errorEmbed({
					desc: 'Solo puedes bloquear canales de texto',
					target: msg,
				})
				return
			}

			if (!ch.permissionsFor(everyone).has('SendMessages')) {
				bot.errorEmbed({
					desc: `El canal ${ch} ya está bloqueado`,
					target: msg,
				})
				return
			}

			ch.edit({
				permissionOverwrites: [
					{
						id: everyone,
						deny: ['SendMessages'],
					},
				],
			})

			bot.successEmbed({
				desc: `🔒 El canal ${ch} está bloqueado`,
				target: msg,
			})

			if (ch.id !== msg.channel.id) {
				ch.send({
					embeds: [
						bot.simpleEmbed({
							desc: `🔒 ${bot.config.emojis.right} Este canal ha sido bloqueado`,
							send: false,
						}),
					],
				})
			}
		},
	},
	slash_command: {
		name: 'lock',
		type: 1,
		description:
			'Bloquea un canal para que ningún usuario pueda escribir en él',
		options: [
			{
				type: ApplicationCommandOptionType.Channel,
				name: 'canal',
				description: 'El canal que se va a bloquear',
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

			if (ch.type !== ChannelType.GuildText) {
				bot.errorEmbed({
					desc: 'Solo puedes bloquear canales de texto',
					target: int,
				})
				return
			}

			if (!ch.permissionsFor(everyone).has('SendMessages')) {
				bot.errorEmbed({
					desc: `El canal ${ch} ya está bloqueado`,
					target: int,
				})
				return
			}

			ch.edit({
				permissionOverwrites: [
					{
						id: everyone,
						deny: ['SendMessages'],
					},
				],
			})

			bot.successEmbed({
				desc: `🔒 El canal ${ch} está bloqueado`,
				target: int,
			})

			if (ch.id !== int.channel.id) {
				ch.send({
					embeds: [
						bot.simpleEmbed({
							desc: `🔒 ${bot.config.emojis.right} Este canal ha sido bloqueado`,
							send: false,
						}),
					],
				})
			}
		},
	},
}
