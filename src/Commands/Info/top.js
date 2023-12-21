const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require('discord.js')
const levelsModel = require('../../Models/levels')

module.exports = {
	name: 'top',
	category: '',
	description: '',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	usage: '',

	prefix_command: {
		aliases: ['t'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const topEmbed = new EmbedBuilder()
				.setColor(bot.config.colors.normal)
				.setTitle('<:purplearrow:1129823325170958457> Top 10')
				.setThumbnail(msg.guild.iconURL())

			const topUsers = await levelsModel
				.find()
				.sort({ level: -1, xp: -1 })
				.limit(10)

			const userPosition =
				(await (
					await levelsModel.find().sort({ level: -1, xp: -1 })
				).findIndex((u) => u.userID == msg.author.id)) + 1

			topEmbed.setFooter({ text: `Tú estas en el top #${userPosition}` })

			const top3 = topUsers.slice(0, 3)
			const top4to10 = topUsers.slice(3, 10)

			const medals = [
				'<:top_one:1187457113455333476>',
				'<:top_two:1187457147072684033>',
				'<:top_three:1187457182149652573>',
			]

			const fieldsTop = []

			for (const [index, user] of top3.entries()) {
				const medal = medals[index]
				fieldsTop.push({
					name: `Top ${index + 1}`,
					value: `${medal} **${user.userName}** - Nivel \`${user.level}\`・\`${user.xp}\` xp`,
				})
			}

			for (const [index, user] of top4to10.entries()) {
				fieldsTop.push({
					name: `Top ${index + 4}`,
					value: `<:purplearrow:1129823325170958457> **${user.userName}** - Nivel \`${user.level}\`・\`${user.xp}\` xp`,
				})
			}

			topEmbed.addFields(fieldsTop)

			msg.reply({ embeds: [topEmbed] })
		},
	},
	slash_command: {
		name: 'top',
		type: 1,
		description: 'Mira el top 10 del servidor',
		options: [],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const topEmbed = new EmbedBuilder()
				.setColor(bot.config.colors.normal)
				.setTitle('<:purplearrow:1129823325170958457> Top 10')
				.setThumbnail(int.guild.iconURL())

			const topUsers = await levelsModel
				.find()
				.sort({ level: -1, xp: -1 })
				.limit(10)

			const userPosition =
				(await (
					await levelsModel.find().sort({ level: -1, xp: -1 })
				).findIndex((u) => u.userID == int.user.id)) + 1

			topEmbed.setFooter({ text: `Tú estas en el top #${userPosition}` })

			const top3 = topUsers.slice(0, 3)
			const top4to10 = topUsers.slice(3, 10)

			const medals = [
				'<:top_one:1187457113455333476>',
				'<:top_two:1187457147072684033>',
				'<:top_three:1187457182149652573>',
			]

			const fieldsTop = []

			for (const [index, user] of top3.entries()) {
				const medal = medals[index]
				fieldsTop.push({
					name: `Top ${index + 1}`,
					value: `${medal} **${user.userName}** - Nivel \`${user.level}\`・\`${user.xp}\` xp`,
				})
			}

			for (const [index, user] of top4to10.entries()) {
				fieldsTop.push({
					name: `Top ${index + 4}`,
					value: `<:purplearrow:1129823325170958457> **${user.userName}** - Nivel \`${user.level}\`・\`${user.xp}\` xp`,
				})
			}

			topEmbed.addFields(fieldsTop)

			int.reply({ embeds: [topEmbed] })
		},
	},
}
