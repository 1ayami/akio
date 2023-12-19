const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	ChannelType,
} = require('discord.js')

module.exports = {
	name: 'nuke',
	category: 'MODERATION',
	description: 'Elimina todo el contenido de un canal',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: ['Administrator'],
	usage: '[canal]',

	prefix_command: {
		aliases: ['n'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const ch = msg.mentions.channels.first() || msg.channel

			if (ch.type !== ChannelType.GuildText) {
				bot.errorEmbed({
					desc: 'Solo puedes nukear un canal de texto',
					target: msg,
				})
				return
			}

			if (ch.id !== msg.channel.id) {
				bot.simpleEmbed({
					desc: `🔥 El canal ${ch} será destruido en unos segundos`,
					target: msg,
				})
			} else {
				bot.simpleEmbed({
					desc: '🔥 Este canal será destruido en unos segundos',
					target: msg,
				})
			}

			const loadBar = await msg.channel.send({ content: '`⬛⬛⬛⬛⬛`' })

			let index = 0
			const animationFrames = [
				'`⬜⬛⬛⬛⬛`',
				'`⬜⬜⬛⬛⬛`',
				'`⬜⬜⬜⬛⬛`',
				'`⬜⬜⬜⬜⬛`',
				'`⬜⬜⬜⬜⬜`',
			]

			const interval = setInterval(() => {
				loadBar.edit(animationFrames[index])

				index++

				if (index === animationFrames.length) {
					clearInterval(interval)

					setTimeout(async () => {
						const c = await ch.clone({
							parent: ch.parent,
						})

						c.setPosition(ch.position)
						ch.delete()

						bot.successEmbed({
							desc: 'Este canal ha sido destruido correctamente',
							target: c,
							type: 'send',
						})

						if (ch.id !== msg.channel.id) {
							bot.successEmbed({
								desc: `El canal ${c} fue destruido correctamente`,
								target: msg,
							})
						}
					}, 200)
				}
			}, 1000)
		},
	},
	slash_command: {
		name: 'nuke',
		type: 1,
		description: 'Destruye un canal',
		options: [
			{
				type: ApplicationCommandOptionType.Channel,
				name: 'canal',
				description: 'Canal para destruir',
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const ch = int.options.getChannel('canal') || int.channel

			if (ch.type !== ChannelType.GuildText) {
				bot.errorEmbed({
					desc: 'Solo puedes nukear un canal de texto',
					target: msg,
				})
				return
			}

			if (ch.id !== int.channel.id) {
				bot.simpleEmbed({
					desc: `🔥 El canal ${ch} será destruido en unos segundos`,
					target: int,
				})
			} else {
				bot.simpleEmbed({
					desc: '🔥 Este canal será destruido en unos segundos',
					target: int,
				})
			}

			const loadBar = await int.channel.send({ content: '`⬛⬛⬛⬛⬛`' })

			let index = 0
			const animationFrames = [
				'`⬜⬛⬛⬛⬛`',
				'`⬜⬜⬛⬛⬛`',
				'`⬜⬜⬜⬛⬛`',
				'`⬜⬜⬜⬜⬛`',
				'`⬜⬜⬜⬜⬜`',
			]

			const interval = setInterval(() => {
				loadBar.edit(animationFrames[index])

				index++

				if (index === animationFrames.length) {
					clearInterval(interval)

					setTimeout(async () => {
						const c = await ch.clone({
							parent: ch.parent,
						})

						c.setPosition(ch.position)
						ch.delete()

						bot.successEmbed({
							desc: 'Este canal ha sido destruido correctamente',
							target: c,
							type: 'send',
						})

						if (ch.id !== int.channel.id) {
							bot.successEmbed({
								desc: `El canal ${c} fue destruido correctamente`,
								target: int,
							})
						}
					}, 200)
				}
			}, 1000)
		},
	},
}
