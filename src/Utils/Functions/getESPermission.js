module.exports = (perm) => {
	const permisesES = require('../Values/permises-es.json')
	const perm_es = permisesES[perm]

	if (!perm_es)
		throw new Error(`❌ El permiso introducido no es válido: ${perm}`)

	return perm_es
}
