const {
	ClientOptions,
	Client,
	Collection,
	Partials,
	EmbedBuilder,
} = require('discord.js')
const { readdirSync } = require('fs')
const embeds = require('../Hanlders/embeds')
const tickets = require('../Hanlders/tickets')
const { asciiv2 } = require('../Config/config')

class AKIO extends Client {
	/**
	 * @param { ClientOptions } options
	 */
	constructor(
		options = {
			shards: 'auto',
			allowedMentions: {
				repliedUser: false,
				parse: ['roles', 'users'],
			},
			presence: {
				activities: [
					{
						name: '2024・00*+',
						type: 0,
					},
				],
				status: 'dnd',
			},
			failIfNotExists: false,
			intents: 3272703,
			partials: [
				Partials.User,
				Partials.Channel,
				Partials.GuildMember,
				Partials.Message,
				Partials.Reaction,
				Partials.ThreadMember,
			],
		}
	) {
		super(options)

		this.commands = new Collection()
		this.slashes = 0
		this.slashCmds = []
		this.config = require('../Config/config')

		Object.assign(this, embeds)
		Object.assign(this, tickets)
	}

	errorEmbed({ desc, type = 'reply', target, send = true, ephemeral }) {
		const embed = new EmbedBuilder()
			.setColor(this.config.colors.error)
			.setDescription(`${this.config.emojis.wrong} ${desc}`)
			.setTitle('Error')

		if (!send) return embed

		if (type && type.toLowerCase().trim() == 'send') {
			return this.sendEmbed({
				embeds: [embed],
				target: target,
			})
		}

		if (type && type.toLowerCase().trim() == 'reply') {
			return this.replyEmbed({
				embeds: [embed],
				target: target,
				ephemeral: ephemeral,
			})
		}
	}

	simpleEmbed({
		desc,
		type = 'reply',
		target,
		send = true,
		ephemeral,
		components,
	}) {
		const embed = new EmbedBuilder()
			.setColor(this.config.colors.normal)
			.setDescription(desc)

		if (!send) return embed

		if (type && type.toLowerCase().trim() == 'send') {
			return this.sendEmbed({
				embeds: [embed],
				target: target,
			})
		}

		if (type && type.toLowerCase().trim() == 'reply') {
			return this.replyEmbed({
				embeds: [embed],
				target: target,
				ephemeral: ephemeral,
				components: components,
			})
		}
	}

	successEmbed({
		desc,
		type = 'reply',
		target,
		send = true,
		ephemeral,
		components,
	}) {
		const embed = new EmbedBuilder()
			.setColor(this.config.colors.success)
			.setDescription(`${this.config.emojis.right} ${desc}`)

		if (!send) return embed

		if (type && type.toLowerCase().trim() == 'send') {
			return this.sendEmbed({
				embeds: [embed],
				target: target,
			})
		}

		if (type && type.toLowerCase().trim() == 'reply') {
			return this.replyEmbed({
				embeds: [embed],
				target: target,
				ephemeral: ephemeral,
				components: components,
			})
		}
	}

	init() {
		const ascii = this.config.ascii

		console.log(asciiv2)

		const functions = readdirSync('./src/Utils/Functions')

		for (const fct of functions) {
			const f = fct.split('.')[0]
			this[f] = require(`../Utils/Functions/${f}`)
		}

		this['loadEvents'](this)
		this['loadCommands'](this)
		this['loadSlashCommands'](this)
		this['mongoDBConnect'](this)

		this.login(process.env.akio_tkn)
	}
}

module.exports = { AKIO }
