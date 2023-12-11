const { readdirSync } = require('fs')
const cmds = readdirSync('./src/Commands/Mod').filter((f) => f !== '_Base.js')

const subCommands = []

for (const c of cmds) {
	const data = require(`../Mod/${c}`).slash_command

	data && data.name ? subCommands.push(data) : null
}

const Base = {
	name: 'mod',
	description: 'Comandos de moderación',
	options: subCommands,
}

module.exports = Base
