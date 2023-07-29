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
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: ['ManageGuild', 'BanMembers'],

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

			if (!member) {
				msg.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} Debes ingresar un usuario para banear`,
						}),
					],
				})
				return
			}

			if (member.user.id == msg.member.user.id) {
				msg.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} No te puedes banear a ti mismo`,
						}),
					],
				})
				return
			}

			await member.ban()
			msg.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsSucessColor,
						description: `${bot.config.emojis.right} El usuario **${member.user.username}** ha sido baneado correctamente`,
					}),
				],
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
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const member = int.options.getMember('member')

			if (int.user.id == member.user.id) {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsErrorColor,
							description: `${bot.config.emojis.wrong} No te puedes banear a ti mismo`,
						}),
					],
				})
				return
			}

			await member.ban()

			int.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsSucessColor,
						description: `${bot.config.emojis.right} El usuario **${member.user.username}** ha sido baneado correctamente`,
					}),
				],
			})
		},
	},
}
