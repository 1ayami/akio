const { AKIO } = require('../Structures/Bot')
const { Message } = require('discord.js')
const { distance } = require('fastest-levenshtein')
const { EmbedBuilder } = require('discord.js')
const Timeouts = new Map()
const ms = require('ms')

module.exports = {
	name: 'messageCreate',

	/**
	 *
	 * @param {AKIO} bot
	 * @param { Message } message
	 */
	async exe(bot, message) {
		const prefix = bot.config.prefix

		if (message.author.bot || !message.content.startsWith(prefix)) return

		const args = message.content.slice(prefix.length).trim().split(' ')

		const command = args.shift().toLowerCase()

		if (!command) return

		const cmd = bot.commands.find(
			(c) => c.name == command || c.prefix_command.aliases?.includes(command)
		)

		if (!cmd) {
			const commands_name = bot.commands.map((c) => ({
				name: c.name,
				distance: distance(command, c.name),
			}))

			const cmd_result = commands_name.sort((a, b) => a.distance - b.distance)

			message.reply({
				embeds: [
					bot.createSimpleEmbed({
						color: bot.config.embedsErrorColor,
						description: `${bot.config.emojis.wrong} No he podido encontrar ese comando, tal vez quisiste decir: \`${prefix}${cmd_result[0].name}\``,
					}),
				],
			})
			return
		}

		if (cmd.category && cmd.category == 'DEVELOPER') {
			if (message.author.id !== bot.config['dev.id']) {
				message.reply({
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
				if (!message.guild.members.me.permissions.has(perm)) {
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

				message.reply({
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
				if (!message.member.permissions.has(perm)) {
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

				message.reply({
					content: `${bot.config.emojis.wrong} No tienes los permisos necesarios para realizar esta acción`,
					embeds: [no_perms_embed],
				})
				return
			}
		}

		if (cmd.nsfw) {
			if (!message.channel.nsfw) {
				message.reply({
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
			const key = `${cmd.name}/${message.author.id}`

			const cooldown = Timeouts.get(`${cmd.name}/${message.author.id}`)

			const now = Date.now()
			const remainingTime = cooldown ? cooldown - now : 0

			if (remainingTime > 0) {
				const remainingTimeString = ms(Date.now() + remainingTime, {
					long: false,
				})
				message.reply({
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
				cmd.prefix_command.exe(bot, message, args)
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
			cmd.prefix_command.exe(bot, message, args)
		} catch (err) {
			console.log(`Ha ocurrido un error con el comando ${cmd.name}`)
			console.log(err)
		}
	},
}