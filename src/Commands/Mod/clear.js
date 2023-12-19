const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
	name: 'clear',
	category: 'MODERATION',
	description: 'Elimina varios mensajes en el chat',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: ['ManageGuild'],
	usage: '<cantidad / usuario>',

	prefix_command: {
		aliases: ['clean', 'limpiar', 'c'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			const amount = args[0]

			if (!amount) {
				bot.errorEmbed({
					desc: 'Debes ingresar una cantidad de mensajes para borrar',
					target: msg,
				})
				return
			}
			if (isNaN(amount)) {
				bot.errorEmbed({
					desc: 'Debes ingresar un número válido',
					target: msg,
				})
				return
			}

			if (Number(amount) < 5 || Number(amount) > 100) {
				bot.errorEmbed({
					desc: 'Debes ingresar un número mayor a **5** y menor o igual a **100**',
					target: msg,
				})
				return
			}

			msg.delete()

			const a = await bot.simpleEmbed({
				desc: `🕝 Eliminando **${amount}** mensajes...`,
				target: msg.channel,
				type: 'send',
			})

			const loadBar = await msg.channel.send({ content: '`⬛⬛⬛`' })

			let index = 0
			const animationFrames = ['`⬜⬛⬛`', '`⬜⬜⬛`', '`⬜⬜⬜`']

			const interval = setInterval(() => {
				loadBar.edit(animationFrames[index])

				index++

				if (index === animationFrames.length) {
					clearInterval(interval)

					setTimeout(async () => {
						await loadBar.delete()
						await a.delete()
						const m = await msg.channel.bulkDelete(Number(amount), true)

						await bot.successEmbed({
							desc: `Se han eliminado **${m.size}/${amount}** mensajes correctamente`,
							target: msg.channel,
							type: 'send',
						})
					}, 200)
				}
			}, 1000)
		},
	},
	slash_command: {
		name: 'clear',
		type: 1,
		description: 'Elimina varios mensajes en el chat',
		options: [
			{
				type: ApplicationCommandOptionType.Number,
				name: 'cantidad',
				description: 'Cantidad de mensajes',
				required: true,
			},
		],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { ChatInputCommandInteraction } int
		 */
		async exe(bot, int) {
			const amount = int.options.getNumber('cantidad')

			if (amount < 5 || amount > 100) {
				bot.errorEmbed({
					desc: 'Debes ingresar un número mayor a **5** y menor o igual a **100**',
					target: int,
				})
				return
			}

			const a = await bot.simpleEmbed({
				desc: `🕝 Eliminando **${amount}** mensajes...`,
				target: int,
			})

			const loadBar = await int.channel.send({ content: '`⬛⬛⬛`' })

			let index = 0
			const animationFrames = ['`⬜⬛⬛`', '`⬜⬜⬛`', '`⬜⬜⬜`']

			const interval = setInterval(() => {
				loadBar.edit(animationFrames[index])

				index++

				if (index === animationFrames.length) {
					clearInterval(interval)

					setTimeout(async () => {
						await loadBar.delete()
						await a.delete()
						const m = await int.channel.bulkDelete(amount, true)

						await bot.successEmbed({
							desc: `Se han eliminado **${m.size}/${amount}** mensajes correctamente`,
							target: int.channel,
							type: 'send',
						})
					}, 200)
				}
			}, 1000)
		},
	},
}
