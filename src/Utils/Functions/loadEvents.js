const { readdirSync } = require('fs')
const { AKIO } = require('../../Structures/Bot')

/**
 * 
 * @param { AKIO } bot 
 */
module.exports = (bot) => {
    bot.removeAllListeners()

    const eventsDir = readdirSync('./src/Events').filter((f) =>
        f.endsWith('.js')
    )

    for (const eventFile of eventsDir) {
        const event = require(`../../Events/${eventFile}`)

        bot.on(event.name, (...args) => event.exe(bot, ...args))
    }

    console.log(`🔮 ${eventsDir.length} Eventos cargados`)
}