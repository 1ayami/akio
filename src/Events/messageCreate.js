const { AKIO } = require('../Structures/Bot')
const { Message } = require('discord.js')
const { distance } = require('fastest-levenshtein')
const Timeouts = new Map()
const levelsModel = require('../Models/levels')
const ms = require('ms')
const { LevelUp } = require('canvafy')

module.exports = {
	name: 'messageCreate',

	/**
	 *
	 * @param {AKIO} bot
	 * @param { Message } message
	 */
	async exe(bot, message) {
		const prefix = bot.config.prefix

		if (message.author.bot) return

		// Sistema de niveles
		const user = await levelsModel.findOne({ userID: message.author.id })

		if (!user) {
			const newUser = new levelsModel({
				userName: message.author.username,
				userID: message.author.id,
				level: 1,
				xp: 1,
			})

			await newUser.save()
		}

		const { xp, level } = await levelsModel.findOne({
			userID: message.author.id,
		})

		const randomXP = Math.floor(Math.random() * 30) + 1
		const levelUP = 5 * level ** 2 + 50 * level + 100

		const levelUPchannel = bot.channels.cache.get('1186827248611889283')

		if (xp + randomXP >= levelUP) {
			await levelsModel.findOneAndUpdate(
				{ userID: message.author.id },
				{ level: level + 1, xp: 1 }
			)

			const card = await new LevelUp()
				.setAvatar(
					message.author.displayAvatarURL({ extension: 'jpg', size: 4096 })
				)
				.setLevels(level, level + 1)
				.setBackground(
					'image',
					'https://media.everskies.com/7SV_5laGsdWQl3YURIpq.jpg'
				)
				.setUsername(message.author.username, '#ffffff')
				.setBorder('#B0CBFF')
				.setAvatarBorder('#B0CBFF')
				.build()

			levelUPchannel.send({
				content: `${message.author} subiste de nivel!!`,
				files: [{ attachment: card, name: 'levelup.png' }],
			})
		} else {
			await levelsModel.findOneAndUpdate(
				{ userID: message.author.id },
				{ xp: xp + randomXP }
			)
		}

		////

		if (!message.content.startsWith(prefix)) return

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

			bot.errorEmbed({
				desc: `No he podido encontrar ese comando\n\n> Tal vez quisiste decir: \`${prefix}${cmd_result[0].name}\``,
				target: message,
			})
			return
		}

		if (cmd.category && cmd.category == 'DEVELOPER') {
			if (message.author.id !== bot.config['dev.id']) {
				bot.errorEmbed({
					desc: 'Este comando puede ser usado solo por el dueño del bot',
					target: message,
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
				bot.noPermsEmbed({
					perms: perms_req,
					target: message,
					type: 'bot',
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
				bot.noPermsEmbed({
					perms: perms_req,
					target: message,
					type: 'user',
				})
				return
			}
		}

		if (cmd.nsfw) {
			if (!message.channel.nsfw) {
				bot.errorEmbed({
					desc: 'Solo puedes usar este comando en un canal **NSFW**',
					target: message,
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
				const remainingTimeString = ms(remainingTime, {
					long: false,
				})

				bot.simpleEmbed({
					desc: `⏱ Por favor espera \`${remainingTimeString}\` para volver a usar este comando`,
					target: message,
				})
				return
			}

			try {
				cmd.prefix_command.exe(bot, message, args)
			} catch (err) {
				console.error(`Ha ocurrido un error con el comando ${cmd.name}`)
				console.log(err)
			}

			Timeouts.set(key, now + cmd.cooldown)

			setTimeout(() => {
				Timeouts.delete(key)
			}, cmd.cooldown)
		} else {
			try {
				cmd.prefix_command.exe(bot, message, args)
			} catch (err) {
				console.error(`Ha ocurrido un error con el comando ${cmd.name}`)
				console.log(err)
			}
		}
	},
}
