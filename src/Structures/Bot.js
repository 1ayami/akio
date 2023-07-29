const {
	ClientOptions,
	Client,
	Collection,
	Partials,
	REST,
	Routes,
	EmbedBuilder,
} = require('discord.js')
const { readdirSync, existsSync } = require('fs')
const axios = require('axios')
const Vibrant = require('node-vibrant')

const slashCmds = []

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
						name: 'The wrld is mine now',
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
		this.config = require('../../Utils/config.json')
	}

	loadEvents() {
		this.removeAllListeners()

		const eventsDir = readdirSync('./src/Events').filter((f) =>
			f.endsWith('.js')
		)

		for (const eventFile of eventsDir) {
			const event = require(`../Events/${eventFile}`)

			this.on(event.name, (...args) => event.exe(this, ...args))
		}

		console.log(`🔮 ${eventsDir.length} Eventos cargados`)
	}

	loadCommands() {
		this.commands.clear()

		const DirCommands = readdirSync('./src/Commands').filter(
			(c) => c !== 'Developer'
		)

		if (DirCommands) {
			for (const category of DirCommands) {
				const Commands = readdirSync(`./src/Commands/${category}`).filter(
					(f) => f.endsWith('.js') && f !== '_Base.js'
				)

				const Base = require(`../Commands/${category}/_Base.js`)

				slashCmds.push(Base)

				for (const cmd of Commands) {
					delete require.cache[
						require.resolve(`../Commands/${category}/${cmd}`)
					]

					const command = require(`../Commands/${category}/${cmd}`)

					if (!command.name) {
						console.log(`❌ El comando en el archivo ${cmd} no tiene un nombre`)

						return
					}

					this.commands.set(command.name, command)

					if (command.slash_command?.name) {
						this.slashes++
					} else {
						console.log(
							`❌ El slash command en el archivo ${cmd} no tiene un nombre`
						)
						return
					}
				}
			}

			console.log(`🔮 ${this.commands.size} PrefixCommands cargados`)
		}
	}

	async loadSlashCommands() {
		const rest = new REST({ version: '10' }).setToken(process.env.akio_tkn)

		await rest.put(Routes.applicationCommands('1124757657723613194'), {
			body: slashCmds,
		})

		console.log(`🔮 ${this.slashes} SlashCommands cargados`)
	}

	createSimpleEmbed({ color, description } = {}) {
		const embed = new EmbedBuilder().setColor(color).setDescription(description)

		return embed
	}

	getESPermission(perm) {
		const permisesES = require('../../Utils/permises-es.json')
		const perm_es = permisesES[perm]

		if (!perm_es)
			throw new Error(`❌ El permiso introducido no es válido: ${perm}`)

		return perm_es
	}

	async getVibrantColor(image) {
		if (typeof image == 'string') {
			try {
				const response = await axios.get(image, {
					responseType: 'arraybuffer',
				})

				const buffer = Buffer.from(response.data, 'binary')

				const vibrant = new Vibrant(buffer)
				const palette = await vibrant.getPalette()

				let dominantColor = palette.Vibrant.hex
				return dominantColor
			} catch (error) {
				console.error('Error:', error)
				return null
			}
		} else {
			const vibrant = new Vibrant(image)

			try {
				const palette = await vibrant.getPalette()
				const dominantColor = palette.Vibrant.hex

				return dominantColor
			} catch (error) {
				console.error('Error:', error)
				return null
			}
		}
	}

	init() {
		const ascii = `\r\n    ___       ___       ___       ___   \r\n   \/\\  \\     \/\\__\\     \/\\  \\     \/\\  \\  \r\n  \/::\\  \\   \/:\/ _\/_   _\\:\\  \\   \/::\\  \\ \r\n \/::\\:\\__\\ \/::-\"\\__\\ \/\\\/::\\__\\ \/:\/\\:\\__\\\r\n \\\/\\::\/  \/ \\;:;-\",-\" \\::\/\\\/__\/ \\:\\\/:\/  \/\r\n   \/:\/  \/   |:|  |    \\:\\__\\    \\::\/  \/ \r\n   \\\/__\/     \\|__|     \\\/__\/     \\\/__\/  \r\n
	`
		console.log(ascii)

		this.loadEvents()
		this.loadCommands()
		this.loadSlashCommands()
		this.login(process.env.akio_tkn)
	}
}

module.exports = { AKIO }
