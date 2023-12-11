const { EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')
const moment = require('moment')

module.exports = {
	noPermsEmbed: function ({ perms, type, target, send = true }) {
		let warnText

		switch (type) {
			case 'user':
				warnText = 'Te faltan permisos para hacer eso'
				break

			case 'bot':
				warnText = 'El bot no tiene permisos suficientes'
				break
		}
		const embed = new EmbedBuilder()
			.setColor(this.config.colors.error)
			.setTitle(`${this.config.emojis.wrong} ${warnText}`)
			.setFields([
				{
					name: `Permisos`,
					value: `\`\`\`${perms.join(' | ')}\`\`\``,
				},
			])
			.setTimestamp()

		if (!send) return embed

		return this.replyEmbed({
			embeds: [embed],
			target: target,
		})
	},

	sendEmbed: function ({ embeds, content, components, target }) {
		return target
			.send({
				embeds: embeds,
				content: content,
				components: components,
			})
			.catch((e) => {})
	},

	replyEmbed: function ({ embeds, content, ephemeral, components, target }) {
		return target
			.reply({
				embeds: embeds,
				content: content,
				components: components,
				ephemeral: ephemeral,
			})
			.catch((e) => {})
	},

	normasEmbeds: (int, bot) => {
		return [
			new EmbedBuilder()
				.setColor(bot.config.colors.normal)
				.setImage('https://i.imgur.com/pQoNJOa.png'),

			new EmbedBuilder()
				.setColor(bot.config.colors.normal)
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
				.setImage('https://i.imgur.com/oHhSW78.png'),
		]
	},

	/**
	 *
	 * @param { ChatInputCommandInteraction } int
	 * @param {*} bot
	 * @returns
	 */
	infoEmbed: (int, bot) => {
		return [
			new EmbedBuilder()
				.setColor(bot.config.colors.normal)
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
						name: '<:purplearrow:1129823325170958457> ID',
						value: int.guild.id,
						inline: true,
					},
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
						name: '<:purplearrow:1129823325170958457> Fecha creación',
						value: `<t:${Math.round(int.guild.createdTimestamp / 1000)}:d>`,
						inline: true,
					},
					{
						name: '<:purplearrow:1129823325170958457> Roles',
						value: `${int.guild.roles.cache.size}`,
						inline: true,
					},
					{
						name: `<:purplearrow:1129823325170958457> Canales (${
							int.guild.channels.cache.filter((c) => c.type !== 4).size
						})`,
						value: `**${
							int.guild.channels.cache.filter((c) => c.type == 0 || c.type == 5)
								.size
						}** texto | **${
							int.guild.channels.cache.filter((c) => c.type == 2).size
						}** voz | **${
							int.guild.channels.cache.filter(
								(c) => c.type == 12 || c.type == 11
							).size
						}** hilos`,
					},
				])
				.setImage('https://i.imgur.com/oHhSW78.png'),
		]
	},

	botTicketEmbed: (int, bot) => {
		return [
			new EmbedBuilder()
				.setColor(bot.config.colors.normal)
				.setImage('https://i.imgur.com/d3zSmq5.jpeg'),

			new EmbedBuilder()
				.setThumbnail(int.guild.iconURL())
				.setColor(bot.config.colors.normal)
				.setImage('https://i.imgur.com/oHhSW78.png')
				.setTitle('> Tickets <a:bluebonkcat:1129915160216211536>')
				.setDescription(
					'<:Reply:884528133552889917> **¿Tienes una duda?** **¿Hallaste algún error o bug?**\nAbre un ticket ahora mismo y cuentanos lo que sucede!\n\n<:gdot:843521006365573142> `Da click en el botón de abajo para empezar`'
				),
		]
	},

	newTicketEmbed: (int, bot) => {
		return [
			new EmbedBuilder()
				.setColor(bot.config.colors.normal)
				.setThumbnail(int.user.displayAvatarURL())
				.setTitle('<:passed:886674467428892672> Nuevo ticket')
				.setDescription(
					`> Bienvenido ${int.user} a tu nuevo ticket, espera mientras un **moderador** llega para resolver tu **problema/duda**. Mientras tanto escribe que es lo que sucede y así resolver más **rapidamente** la situación :)`
				)
				.setAuthor({ iconURL: int.guild.iconURL(), name: int.guild.name }),
		]
	},
}
