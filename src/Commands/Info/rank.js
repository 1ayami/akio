const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	GuildMember,
	Attachment,
} = require('discord.js')
const { Rank } = require('canvafy')
const levelsModel = require('../../Models/levels')

module.exports = {
	name: 'rank',
	category: 'INFORMATION',
	description: 'Mira tu rank en el servidor',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	usage: '[usuario]',

	prefix_command: {
		aliases: ['r'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			/**
			 * @type { GuildMember } member
			 */
			const member =
				msg.mentions.members.first() ||
				msg.guild.members.cache.get(args[0]) ||
				msg.member

			const userLvL = await levelsModel.findOne({ userID: member.user.id })

			if (!userLvL) {
				bot.errorEmbed({
					desc: 'Este usuario aún no ha interactuado en el servidor',
					target: msg,
				})
			}

			const ranking = await levelsModel.find().sort({ level: -1, xp: -1 })

			const userRank = ranking.findIndex(
				(user) => member.user.id == user.userID
			)

			const newCard = await new Rank()
				.setAvatar(
					member.user.displayAvatarURL({ extension: 'jpg', size: 4096 })
				)
				.setBackground(
					'image',
					'https://media.everskies.com/7SV_5laGsdWQl3YURIpq.jpg'
				)
				.setUsername(member.user.username)
				.setCustomStatus('#B0CBFF')
				.setBorder('#B0CBFF')
				.setBarColor('#B0CBFF')
				.setLevel(userLvL.level, 'nivel')
				.setLevelColor({ text: '#ffffff', number: '#ffffff' })
				.setRank(userRank + 1, 'Rank')
				.setRankColor({ text: '#ffffff', number: '#ffffff' })
				.setCurrentXp(userLvL.xp)
				.setRequiredXp(5 * userLvL.level ** 2 + 50 * userLvL.level + 100)
				.build()

			msg.reply({ files: [{ attachment: newCard, name: 'rank.jpg' }] })
		},
	},
	slash_command: {
		name: 'rank',
		type: 1,
		description: 'Mira tu tarjeta de rank o de otro usuario',
		options: [
			{
				type: ApplicationCommandOptionType.User,
				name: 'miembro',
				description: 'Miembro del cual quieres ver su rank',
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const member = int.options.getMember('miembro') || int.member

			const userLvL = await levelsModel.findOne({ userID: member.user.id })

			if (!userLvL) {
				bot.errorEmbed({
					desc: 'Este usuario aún no ha interactuado en el servidor',
					target: int,
				})
			}

			const ranking = await levelsModel.find().sort({ level: -1, xp: -1 })

			const userRank = ranking.findIndex(
				(user) => member.user.id == user.userID
			)

			const newCard = await new Rank()
				.setAvatar(
					member.user.displayAvatarURL({ extension: 'jpg', size: 4096 })
				)
				.setBackground(
					'image',
					'https://media.everskies.com/7SV_5laGsdWQl3YURIpq.jpg'
				)
				.setUsername(member.user.username)
				.setCustomStatus('#B0CBFF')
				.setBorder('#B0CBFF')
				.setBarColor('#B0CBFF')
				.setLevel(userLvL.level, 'nivel')
				.setLevelColor({ text: '#ffffff', number: '#ffffff' })
				.setRank(userRank + 1, 'Rank')
				.setRankColor({ text: '#ffffff', number: '#ffffff' })
				.setCurrentXp(userLvL.xp)
				.setRequiredXp(5 * userLvL.level ** 2 + 50 * userLvL.level + 100)
				.build()

			int.reply({ files: [{ attachment: newCard, name: 'rank.jpg' }] })
		},
	},
}
