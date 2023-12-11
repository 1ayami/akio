const { readdirSync } = require('fs')

module.exports = (bot) => {
	bot.commands.clear()

	const DirCommands = readdirSync('./src/Commands')

	if (DirCommands) {
		for (const category of DirCommands) {
			const Commands = readdirSync(`./src/Commands/${category}`).filter(
				(f) => f.endsWith('.js') && f !== '_Base.js'
			)

			if (category !== 'Developer') {
				const Base = require(`../../Commands/${category}/_Base.js`)

				bot.slashCmds.push(Base)
			}

			for (const cmd of Commands) {
				delete require.cache[
					require.resolve(`../../Commands/${category}/${cmd}`)
				]

				const command = require(`../../Commands/${category}/${cmd}`)

				if (!command.name) {
					console.error(`❌ El comando en el archivo ${cmd} no tiene un nombre`)

					return
				}

				bot.commands.set(command.name, command)

				if (command.slash_command?.name) {
					bot.slashes++
				} else if (command.slash_command && !command.slash_command.name) {
					console.error(
						`❌ El slash command en el archivo ${cmd} no tiene un nombre`
					)
				}
			}
		}

		console.log(`🔮 ${bot.commands.size} PrefixCommands cargados`)
	}
}
