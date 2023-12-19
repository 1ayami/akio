const { REST, Routes } = require('discord.js')

module.exports = async (bot) => {
	const rest = new REST({ version: '10' }).setToken(process.env.akio_tkn)

	await rest.put(Routes.applicationCommands('1124757657723613194'), {
		body: bot.slashCmds,
	})

	console.log(`✅ ${bot.slashes} SlashCommands cargados`)
}
