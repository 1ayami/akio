const { AKIO } = require('../Structures/Bot')
const {
	EmbedBuilder,
	BaseInteraction,
	ButtonStyle,
	ButtonBuilder,
	ActionRowBuilder,
} = require('discord.js')
const Timeouts = new Map()
const ms = require('ms')

module.exports = {
	name: 'interactionCreate',

	/**
	 *
	 * @param { AKIO } bot
	 * @param { BaseInteraction } int
	 */
	async exe(bot, int) {
		await int.user.fetch()

		if (int.isStringSelectMenu()) {
			if (int.customId == 'menu-inicio') {
				switch (int.values[0]) {
					case 'normas-op':
						int.reply({ embeds: bot.normasEmbeds(int, bot), ephemeral: true })

						break

					case 'server-op':
						int.reply({ embeds: bot.infoEmbed(int, bot), ephemeral: true })
						break

					case 'ticket-op':
						const ticketCreateButton = new ButtonBuilder()
							.setLabel('Abrir ticket!')
							.setStyle(ButtonStyle.Primary)
							.setCustomId('create_ticket')
							.setEmoji('🔮')

						const row = new ActionRowBuilder().addComponents(ticketCreateButton)

						int.reply({
							embeds: bot.botTicketEmbed(int, bot),
							components: [row],
							ephemeral: true,
						})
						break
				}
			}
		}

		if (int.isButton()) {
			const TicketFuncionts = {
				create_ticket: () => bot.createTicket(int, bot),
				close_ticket_nodef: () => bot.closeTicketNoDef(int, bot),
				close_ticket_def: () => bot.closeTicketDef(int, bot),
				delete_ticket: () => bot.deleteTicket(int, bot),
				create_transcript: () => bot.createTranscript(int),
			}

			if (int.customId in TicketFuncionts) {
				TicketFuncionts[int.customId]()
			}
		}

		if (int.isChatInputCommand()) {
			const name = int.options.getSubcommand()

			const cmd = bot.commands.get(name)

			if (cmd.category && cmd.category == 'DEVELOPER') {
				if (int.user.id !== bot.config['dev.id']) {
					bot.errorEmbed({
						desc: 'Este comando puede ser usado solo por el dueño del bot',
						target: int,
					})
					return
				}
			}

			if (cmd.bot_permises?.length) {
				let perms_req = []

				for (const perm of cmd.bot_permises) {
					if (!int.guild.members.me.permissions.has(perm)) {
						let permsES = bot.getESPermission(perm)
						perms_req.push(permsES)
					}
				}

				if (perms_req.length) {
					bot.noPermsEmbed({
						perms: perms_req,
						target: int,
						type: 'bot',
					})
					return
				}
			}

			if (cmd.user_permises?.length) {
				let perms_req = []

				for (const perm of cmd.user_permises) {
					let permsES = bot.getESPermission(perm)
					if (!int.member.permissions.has(perm)) {
						perms_req.push(permsES)
					}
				}

				if (perms_req.length) {
					bot.noPermsEmbed({
						perms: perms_req,
						target: int,
						type: 'user',
					})
					return
				}
			}

			if (cmd.nsfw) {
				if (!int.channel.nsfw) {
					bot.errorEmbed({
						desc: 'Solo puedes usar este comando en un canal **NSFW**',
						target: int,
					})
					return
				}
			}

			if (cmd.cooldown) {
				const key = `${cmd.name}/${int.user.id}`

				const cooldown = Timeouts.get(`${cmd.name}/${int.user.id}`)

				const now = Date.now()
				const remainingTime = cooldown ? cooldown - now : 0

				if (remainingTime > 0) {
					const remainingTimeString = ms(Date.now() + remainingTime, {
						long: false,
					})

					bot.simpleEmbed({
						desc: `⏱ Por favor espera ${remainingTimeString} para volver a usar este comando`,
						target: int,
					})

					return
				}

				try {
					cmd.slash_command.exe(bot, int)
				} catch (err) {
					console.log(`Ha ocurrido un error con el comando ${cmd.name}`)
					console.log(err)
				}

				Timeouts.set(key, now + cmd.cooldown)

				setTimeout(() => {
					Timeouts.delete(key)
				}, cmd.cooldown)
			}

			try {
				cmd.slash_command.exe(bot, int)
			} catch (err) {
				console.log(`Ha ocurrido un error con el comando ${cmd.name}`)
				console.log(err)
			}
		}
	},
}
