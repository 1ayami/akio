const { readdirSync } = require('fs')
const cmds = readdirSync('./src/Commands/Misc').filter((f) => f !== '_Base.js')

const subCommands = []

for (const c of cmds) {
	const data = require(`../Misc/${c}`).slash_command

	data ? subCommands.push(data) : null
}

const Base = {
	name: 'misc',
	description: 'Comandos variados',
	options: subCommands,
}

module.exports = Base
