const { readdirSync } = require('fs')
const cmds = readdirSync('./src/Commands/Info').filter((f) => f !== '_Base.js')

const subCommands = []

for (const c of cmds) {
	const data = require(`../Info/${c}`).slash_command

	data && data.name ? subCommands.push(data) : null
}

const Base = {
	name: 'info',
	description: 'Comandos de información',
	options: subCommands,
}

module.exports = Base
