const Vibrant = require('node-vibrant')

module.exports = async (imagen) => {
	try {
		const paleta = await Vibrant.from(imagen).getPalette()

		const colorDominante = paleta.Vibrant.hex

		return colorDominante
	} catch (error) {
		console.error('Error al obtener el color dominante:', error.message)
		return null
	}
}
