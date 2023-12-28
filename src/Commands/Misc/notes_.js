const { AKIO } = require('../../Structures/Bot')
const {
	Message,
	MessageCollector,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
} = require('discord.js')
const notesModel = require('../../Models/notes')

module.exports = {
	name: 'notes',
	category: 'MISC',
	description: 'Guarda notas para después, máximo 5',
	bot_permises: ['ViewChannel', 'SendMessages'],
	user_permises: [],
	usage: '[add / remove / show] [nota / 1 - 5]',

	prefix_command: {
		aliases: ['notas'],

		/**
		 *
		 * @param { AKIO } bot
		 * @param { Message } msg
		 * @param { string[] } args
		 */
		async exe(bot, msg, args) {
			let notesUser = await notesModel.findOne({ userID: msg.author.id })

			const options = ['add', 'remove', 'show']
			const option = args[0]

			if (!option) {
				if (!notesUser) {
					bot.errorEmbed({
						desc: 'Aún no tienes ninguna nota. Agrega una con `akio notes add`',
						target: msg,
					})

					return
				}

				if (!notesUser.notes.length) {
					bot.errorEmbed({
						desc: 'Aún no tienes ninguna nota. Agrega una con `akio notes add`',
						target: msg,
					})

					return
				}

				const notes = notesUser.notes.map((n) => n.title)
				bot.simpleEmbed({
					desc: notes
						.map(
							(t) =>
								`<:purplearrow:1129823325170958457> \`${
									notes.indexOf(t) + 1
								}\` - **${t}**`
						)
						.join('\n'),
					target: msg,
				})

				return
			}

			if (option && !options.includes(option)) {
				bot.errorEmbed({
					desc: 'No has ingresado una opción válida\n> Opciones: `add | remove | show`',
					target: msg,
				})

				return
			}

			if (option === 'add') {
				if (notesUser && notesUser.notes.length >= 5) {
					bot.errorEmbed({
						desc: 'Ya has alcanzado el límite máximo de 5 notas. Elimina algunas antes de agregar nuevas',
						target: msg,
					})

					return
				}

				const title = args.slice(1).join(' ')

				if (!title) {
					bot.errorEmbed({
						desc: 'Debes proporcionar un título para la nota',
						target: msg,
					})

					return
				}

				if (!notesUser) {
					const newNotesUser = new notesModel({
						userName: msg.author.username,
						userID: msg.author.id,
						notes: [{ title: title, note: '' }],
					})
					await newNotesUser.save()

					notesUser = await notesModel.findOne({ userID: msg.author.id })
				} else {
					notesUser.notes.push({ title: title, note: '' })
					await notesUser.save()
				}

				await bot.simpleEmbed({
					desc: `Por favor, ingresa el contenido de la nota para **${title}**:`,
					type: 'send',
					target: msg.channel,
				})

				const noteCollectorFilter = (collectorMsg) =>
					collectorMsg.author.id === msg.author.id
				const noteCollector = new MessageCollector(msg.channel, {
					max: 1,
					time: 60000,
					filter: noteCollectorFilter,
					time: 60000,
				})

				noteCollector.on('collect', (collectorMsg) => {
					const content = collectorMsg.content
					collectorMsg.delete()
					noteCollector.stop()

					const updatedNote = notesUser.notes.find((n) => n.title === title)

					if (updatedNote) {
						updatedNote.note = content
						notesUser.save()
						bot.successEmbed({
							desc: `Nota **${title}** agregada exitosamente`,
							target: msg,
						})
					}
				})

				noteCollector.on('end', async (collected, reason) => {
					if (reason === 'time') {
						await notesModel.updateOne(
							{ userID: msg.author.id },
							{ $pull: { notes: { title: title } } }
						)
						bot.errorEmbed({
							desc: 'Se agotó el tiempo para ingresar el contenido de la nota',
							target: msg,
						})
					}
				})

				return
			}

			if (option === 'remove') {
				const index = parseInt(args[1])

				if (isNaN(index) || index < 1 || index > 5) {
					bot.errorEmbed({
						desc: 'Debes ingresar un número del 1 al 5 para eliminar una nota',
						target: msg,
					})

					return
				}

				if (!notesUser || !notesUser.notes[index - 1]) {
					bot.errorEmbed({
						desc: 'No hay una nota en esa posición para eliminar',
						target: msg,
					})

					return
				}

				notesUser.notes.splice(index - 1, 1)
				await notesUser.save()

				bot.successEmbed({
					desc: 'Nota eliminada exitosamente',
					target: msg,
				})

				return
			}

			if (option === 'show') {
				const index = parseInt(args[1])

				if (isNaN(index) || index < 1 || index > 5) {
					bot.errorEmbed({
						desc: 'Debes ingresar un número del 1 al 5 para mostrar una nota',
						target: msg,
					})

					return
				}

				if (!notesUser || !notesUser.notes[index - 1]) {
					bot.errorEmbed({
						desc: 'No hay una nota en esa posición para mostrar',
						target: msg,
					})

					return
				}

				const noteTitle = notesUser.notes[index - 1].title
				const noteText = notesUser.notes[index - 1].note

				bot.successEmbed({
					desc: `**${noteTitle}:**\n${noteText}`,
					target: msg,
				})

				return
			}
		},
	},
	// slash_command: {
	// 	name: 'notes',
	// 	type: ApplicationCommandOptionType.SubcommandGroup,
	// 	description: 'Guarda notas para después, máximo 5',
	// 	options: [
	// 		{
	// 			name: 'add',
	// 			type: ApplicationCommandOptionType.Subcommand,
	// 			description: 'Agrega una nueva nota',
	// 			options: [
	// 				{
	// 					name: 'titulo',
	// 					type: ApplicationCommandOptionType.String,
	// 					description: 'Título de la nueva nota',
	// 					required: true,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			name: 'remove',
	// 			type: ApplicationCommandOptionType.Subcommand,
	// 			description: 'Elimina una nota',
	// 			options: [
	// 				{
	// 					name: 'numero',
	// 					type: ApplicationCommandOptionType.Number,
	// 					description: 'Número de la nota a eliminar',
	// 					required: true,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			name: 'show',
	// 			type: ApplicationCommandOptionType.Subcommand,
	// 			description: 'Muestra una de tus notas',
	// 			options: [
	// 				{
	// 					name: 'numero',
	// 					type: ApplicationCommandOptionType.Number,
	// 					description: 'Número de la nota a mostrar',
	// 					required: true,
	// 				},
	// 			],
	// 		},
	// 	],
	// },
}
