const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
	name: 'lock',
	category: 'MODERATION',
	description: 'Bloquea un canal para que ningún usuario pueda escribir en él',
	bot_permises: ['ViewChannel', 'SendMessages'],
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
				msg.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Debes especificar un canal para bloquear`,
						}),
					],
				})
				return
			}

			if (!ch.permissionsFor(everyone).has('SendMessages')) {
				msg.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} El canal ${ch} ya está bloqueado`,
						}),
					],
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

			msg.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsSucessColor,
						description: `🔒 ${bot.config.emojis.right} El canal ${ch} está bloqueado`,
					}),
				],
			})

			if (ch.id !== msg.channel.id) {
				ch.send({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsSucessColor,
							description: `🔒 ${bot.config.emojis.right} Este canal ha sido bloqueado`,
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

			if (!ch) {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Debes especificar un canal para bloquear`,
						}),
					],
				})
				return
			}

			if (!ch.permissionsFor(everyone).has('SendMessages')) {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} El canal ${ch} ya está bloqueado`,
						}),
					],
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

			int.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsSucessColor,
						description: `🔒 ${bot.config.emojis.right} El canal ${ch} está bloqueado`,
					}),
				],
			})

			if (ch.id !== int.channel.id) {
				ch.send({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsSucessColor,
							description: `🔒 ${bot.config.emojis.right} Este canal ha sido bloqueado`,
						}),
					],
				})
			}
		},
	},
}
