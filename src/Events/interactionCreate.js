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
						const normasImage = new EmbedBuilder()
							.setColor(bot.config.embedsDefaultColor)
							.setImage('https://i.imgur.com/pQoNJOa.png')

						const normasEmbed = new EmbedBuilder()
							.setColor(bot.config.embedsDefaultColor)
							.setTitle(
								'> <:guia:999846433022820462>・Normas de la comunidad **Genesis**'
							)
							.setDescription(
								'Si quieres permanecer en esta comunidad por el mayor tiempo posible y sin tener ningún contratiempo, te recomendamos leer todas las normas.\nDado que este servidor busca mantener la completa paz tanto dentro como fuera del mismo, también recomendamos tener en cuenta las:\n<:gdot:843521006365573142> [**Directrices de comunidad de Discord**](https://discord.com/guidelines) y [**Términos de servicio de Discord**](https://discord.com/terms)\n\n```diff\n--- Las proximas normas deben ser cumplidas por todos los miembros del servidor ---\n```'
							)
							.addFields([
								{
									name: `<:purplearrow:1129823325170958457> __Autopromoción__`,
									value:
										'Están prohibidos las **promociones** o **invitaciones** a otros servidores de Discord (sin autorización), **enlaces a redes sociales** propias o ajenas, entre otros, esto también incluye el spam por mensaje directo a miembros del servidor.',
									inline: true,
								},
								{
									name: `<:purplearrow:1129823325170958457> __Mensajes demasiado largos__`,
									value:
										'Los mensajes **demasiado largos** están prohibidos, esto para evitar incomodar la conversación de los demás, en caso de que tu mensaje sea mayor a las 250 caracteres de contenido, será **eliminado** y serás avisado.',
									inline: true,
								},
								{
									name: `<:purplearrow:1129823325170958457> __Contenido NSFW__`,
									value:
										'Está completamente prohibido el **contenido NSFW**, (esto incluye imágenes, vídeos, gifs, etc.) fuera de canales no autorizados, de lo contrario esto podría llevar a un **baneo automático**.',
									inline: true,
								},
								{
									name: `<:purplearrow:1129823325170958457> __Uso incorrecto de los canales__`,
									value: `Cada canal tiene una **función específica**, usa cada canal según para lo que haya sido creado, por ejemplo no está permitido usar comandos de bots en ${int.guild.channels.cache.find(
										(c) => c.name == '・💬・general'
									)}.`,
									inline: true,
								},
								{
									name: `<:purplearrow:1129823325170958457> __Flood__`,
									value:
										'No se permite el **flood**, (enviar mensajes en un corto intervalo de tiempo), en este caso no está permitido enviar 5 mensajes en 10 segundos o automáticamente podrás llevarte una **sanción**.',
									inline: true,
								},
								{
									name: `<:purplearrow:1129823325170958457> __Canales de voz__`,
									value:
										'No se permite usar **moduladores**, hacer **ruidos incómodos** o **gritar**, ya que esto incómoda y arruina la experiencia de los demás miembros en el canal de voz',
									inline: true,
								},
								{
									name: `<:check:873992083743064075> Aviso`,
									value:
										'```diff\n--- La lista de normas podrá ser modificada en un futuro y los moderadores podrán sancionarte por razones que no se especifican aquí ---\n```',
								},
							])
							.setImage('https://i.imgur.com/oHhSW78.png')

						int.reply({ embeds: [normasImage, normasEmbed], ephemeral: true })

						break

					case 'server-op':
						const infoEmbed = new EmbedBuilder()
							.setColor(bot.config.embedsDefaultColor)
							.setThumbnail(int.guild.iconURL())
							.setTitle(
								'<:home:1129823656953004053> Información del servidor Genesis'
							)
							.setDescription(
								`Bienvenid@ a la comunidad **[Genesis](https://discord.gg/Kt6TV3CXAm)**, en este servidor podrás conversar y divertirte con personas de la comunidad hispanoablante. Este servidor, iniciado y organizado por ${int.guild.members.cache.get(
									int.guild.ownerId
								)}, está también enfocado en creación de bots y programación en general.`
							)
							.addFields([
								{
									name: '<:purplearrow:1129823325170958457> Usuarios',
									value: `\`${
										int.guild.members.cache.filter((m) => !m.user.bot).size
									}\``,
									inline: true,
								},
								{
									name: '<:purplearrow:1129823325170958457> Bots',
									value: `\`${
										int.guild.members.cache.filter((m) => m.user.bot).size
									}\``,
									inline: true,
								},
								{
									name: '<:purplearrow:1129823325170958457> Fecha de creación',
									value: `<t:1675720620:D>`,
									inline: true,
								},
							])
							.setImage('https://i.imgur.com/oHhSW78.png')

						int.reply({ embeds: [infoEmbed], ephemeral: true })
						break

					case 'ticket-op':
						const ticketsImage = new EmbedBuilder()
							.setColor(bot.config.embedsDefaultColor)
							.setImage('https://i.imgur.com/d3zSmq5.jpeg')

						const ticketsEmbed = new EmbedBuilder()
							.setThumbnail(int.guild.iconURL())
							.setColor(bot.config.embedsDefaultColor)
							.setImage('https://i.imgur.com/oHhSW78.png')
							.setTitle('> Tickets <a:bluebonkcat:1129915160216211536>')
							.setDescription(
								'<:Reply:884528133552889917> **¿Tienes una duda?** **¿Hallaste algún error o bug?**\nAbre un ticket ahora mismo y cuentanos lo que sucede!\n\n<:gdot:843521006365573142> `Da click en el botón de abajo para empezar`'
							)

						const ticketCreateButton = new ButtonBuilder()
							.setLabel('Abrir ticket!')
							.setStyle(ButtonStyle.Primary)
							.setCustomId('create_ticket')
							.setEmoji('🔮')

						const row = new ActionRowBuilder().addComponents(ticketCreateButton)

						int.reply({
							embeds: [ticketsImage, ticketsEmbed],
							components: [row],
							ephemeral: true,
						})
						break
				}
			}
		}

		if (int.isButton()) {
			if (int.customId === 'create_ticket') {
				const findTicketChannel = int.guild.channels.cache.find(
					(c) => c.name == `ticket-${int.user.id}`
				)

				if (findTicketChannel) {
					return int.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsErrorColor,
								description: `${bot.config.emojis.wrong} Ya tienes un ticket abierto: ${findTicketChannel}`,
							}),
						],
						ephemeral: true,
					})
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

				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsSucessColor,
							description: `${bot.config.emojis.right} Tu ticket fue creado correctamente: ${newticketChannel}`,
						}),
					],
					ephemeral: true,
				})

				const newTicketEmbed = new EmbedBuilder()
					.setColor(bot.config.embedsDefaultColor)
					.setThumbnail(int.user.displayAvatarURL())
					.setTitle('<:passed:886674467428892672> Nuevo ticket')
					.setDescription(
						`> Bienvenido ${int.user} a tu nuevo ticket, espera mientras un **moderador** llega para resolver tu **problema/duda**. Mientras tanto escribe que es lo que sucede y así resolver más **rapidamente** la situación :)`
					)
					.setAuthor({ iconURL: int.guild.iconURL(), name: int.guild.name })

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
					embeds: [newTicketEmbed],
					components: [rowTicketCloseButtonNoDef],
				})
			}

			if (int.customId == 'close_ticket_nodef') {
				const ticketCloseButtonConfirm = new ButtonBuilder()
					.setLabel('Si')
					.setStyle(ButtonStyle.Success)
					.setCustomId('close_ticket_def')

				const rowTicketCloseButtonDef = new ActionRowBuilder().addComponents(
					ticketCloseButtonConfirm
				)

				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsDefaultColor,
							description:
								'<:advertencia:895442719038656552> Estas segur@ de que quieres cerrar este ticket?',
						}),
					],
					components: [rowTicketCloseButtonDef],
					fetchReply: true,
					ephemeral: true,
				})
			}

			if (int.customId == 'close_ticket_def') {
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

				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsSucessColor,
							description: `${bot.config.emojis.right} El ticket se ha cerrado correctamente`,
						}),
					],
					components: [rowticketDeleteButton],
				})
			}

			if (int.customId == 'delete_ticket') {
				int.reply({
					embeds: [
						bot.createSimpleEmbed({
							color: bot.config.embedsDefaultColor,
							description: '> ⏰ Eliminando el canal en unos segundos...',
						}),
					],
				})

				setTimeout(() => {
					int.channel.delete()
				}, 5000)
			}

			if (int.customId == 'create_transcript') {
				const attchTranscript = await createTranscript(int.channel)

				int.reply({ files: [attchTranscript] })
			}
		}

		if (int.isChatInputCommand()) {
			const name = int.options.getSubcommand()

			const cmd = bot.commands.get(name)

			if (cmd.category && cmd.category == 'DEVELOPER') {
				if (int.user.id !== bot.config['dev.id']) {
					int.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsErrorColor,
								description: `${bot.config.emojis.wrong} Este comando puede ser usado solo por el dueño del bot`,
							}),
						],
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
					let no_perms_embed = new EmbedBuilder({
						fields: [
							{
								name: `> Permiso(s) necesarios`,
								value: `\`${perms_req.join(' | ')}\``,
							},
						],
					}).setColor(bot.config.embedsErrorColor)

					int.reply({
						content: `${bot.config.emojis.wrong} El bot no tiene los permisos necesarios para realizar esta acción`,
						embeds: [no_perms_embed],
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
					let no_perms_embed = new EmbedBuilder({
						fields: [
							{
								name: `> Permiso(s) necesarios`,
								value: `\`${perms_req.join(' | ')}\``,
							},
						],
					}).setColor(bot.config.embedsErrorColor)

					int.reply({
						content: `${bot.config.emojis.wrong} No tienes los permisos necesarios para realizar esta acción`,
						embeds: [no_perms_embed],
					})
					return
				}
			}

			if (cmd.nsfw) {
				if (!int.channel.nsfw) {
					int.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsErrorColor,
								description: `${bot.config.emojis.wrong} Solo puedes usar este comando en un canal **NSFW**`,
							}),
						],
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
					int.reply({
						embeds: [
							bot.createSimpleEmbed({
								color: bot.config.embedsDefaultColor,
								description: `⏱ Por favor espera ${remainingTimeString} para volver a usar este comando`,
							}),
						],
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
