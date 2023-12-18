const { EmbedBuilder, GuildMember } = require('discord.js')
const { AKIO } = require('../Structures/Bot')

module.exports = {
	name: 'guildMemberAdd',

	/**
	 *
	 * @param { AKIO } bot
	 * @param { GuildMember } member
	 */
	exe(bot, member) {
		const embedWLC = new EmbedBuilder()
			.setColor(bot.config.colors.normal)
			.setThumbnail(member.user.displayAvatarURL({ size: 4096 }))
			.setAuthor({ name: 'Genesis*', iconURL: member.guild.iconURL() })
			.setTitle(`> Un nuevo usuario ha ingresado <:ztar:902305429474934824>!`)
			.setDescription(
				`Bienvenid@ ${member} a **Genesis**!, si necesitas saber algo, te recomiendo revisar el canal <#1072240599081689119>. Ten la total libertad de explorar los canales y resolver cualquier duda que tengas con los moderadores o dueño del servidor!\n\nPuedes ir a saludar a <#1110740317935767612>!`
			)
			.setImage('https://i.imgur.com/N1r89gK.jpeg')

		const canal = member.guild.channels.cache.get('1072240602978193428')

		canal.send({ content: `${member}`, embeds: [embedWLC] })
	},
}
