const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const { createTranscript } = require('discord-html-transcripts')

module.exports = {
	async createTicket(int, bot) {
		const findTicketChannel = int.guild.channels.cache.find(
			(c) => c.name == `ticket-${int.user.id}`
		)

		if (findTicketChannel) {
			bot.errorEmbed({
				desc: `Ya tienes un ticket abierto: ${findTicketChannel}`,
				target: int,
				ephemeral: true,
			})

			return
		}

		const newticketChannel = await int.guild.channels.create({
			name: `ticket-${int.user.id}`,
			type: 0,
			parent: '1072242731608444958',
			permissionOverwrites: [
				{
					id: '1072237774134071307',
					deny: ['SendMessages', 'ViewChannel'],
				},
				{
					id: int.user.id,
					allow: ['SendMessages', 'ViewChannel'],
				},
				{
					id: '1072237774402502718',
					allow: ['SendMessages', 'ViewChannel', 'ManageMessages'],
				},
			],
		})

		bot.successEmbed({
			desc: `Tu ticket fue creado correctamente: ${newticketChannel}`,
			target: int,
			ephemeral: true,
		})

		const ticketCloseButtonNoDef = new ButtonBuilder()
			.setLabel('Cerrar ticket!')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('close_ticket_nodef')
			.setEmoji('886674267595477072')

		const rowTicketCloseButtonNoDef = new ActionRowBuilder().addComponents(
			ticketCloseButtonNoDef
		)

		newticketChannel.send({
			content: `${int.user} <@&1072237774402502718>`,
			embeds: bot.newTicketEmbed(int, bot),
			components: [rowTicketCloseButtonNoDef],
		})
	},

	closeTicketNoDef: (int, bot) => {
		const ticketCloseButtonConfirm = new ButtonBuilder()
			.setLabel('Si')
			.setStyle(ButtonStyle.Success)
			.setCustomId('close_ticket_def')

		const rowTicketCloseButtonDef = new ActionRowBuilder().addComponents(
			ticketCloseButtonConfirm
		)

		bot.simpleEmbed({
			desc: '<:advertencia:895442719038656552> Estas segur@ de que quieres cerrar este ticket?',
			components: [rowTicketCloseButtonDef],
			target: int,
			ephemeral: true,
		})
	},

	closeTicketDef: async (int, bot) => {
		await int.channel.edit({
			permissionOverwrites: [
				{
					id: int.user.id,
					deny: ['SendMessages', 'ViewChannel'],
				},
			],
		})

		const ticketDeleteButton = new ButtonBuilder()
			.setLabel('Eliminar ticket')
			.setStyle(ButtonStyle.Danger)
			.setEmoji('886674267595477072')
			.setCustomId('delete_ticket')

		const channelTranscript = new ButtonBuilder()
			.setLabel('Transcript')
			.setStyle(ButtonStyle.Primary)
			.setEmoji('📘')
			.setCustomId('create_transcript')

		const rowticketDeleteButton = new ActionRowBuilder().addComponents(
			ticketDeleteButton,
			channelTranscript
		)

		bot.successEmbed({
			desc: 'El ticket se ha cerrado correctamente',
			target: int,
			components: [rowticketDeleteButton],
		})
	},

	deleteTicket: async (int, bot) => {
		await bot.simpleEmbed({
			desc: '⏰ Eliminando el canal en unos segundos...',
			target: int,
		})

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

				setTimeout(() => {
					int.channel.delete()
				}, 200)
			}
		}, 1000)
	},

	createTranscript: async (int) => {
		const attchTranscript = await createTranscript(int.channel)

		int.reply({ files: [attchTranscript] })
	},
}
