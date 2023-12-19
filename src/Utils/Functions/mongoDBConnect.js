const { AKIO } = require('../../Structures/Bot')
const mongoose = require('mongoose')

/**
 * 
 * @param { AKIO } bot 
 */
module.exports = async (bot) => {
    let isConnected = false
			let retries = 0

			while (!isConnected && retries < 25) {
				try {
					await mongoose.connect(process.env.MONGO_URL)

					isConnected = mongoose.connection.readyState === 1
				} catch (error) {
					console.error('Error al conectar a MongoDB:', error)
				}

				retries++

				await new Promise((resolve) => setTimeout(resolve, 1000))
			}

			if (isConnected) {
				console.log('✅ Conectado a MongoDB')
			} else {
				console.error(
					'No se pudo establecer conexión a MongoDB después de varios intentos'
				)
			}
}