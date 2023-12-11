const { VoiceState } = require('discord.js')
const { AKIO } = require('../Structures/Bot')

const map = new Map()

module.exports = {
	name: 'voiceStateUpdate',

	/**
	 *
	 * @param {AKIO} bot
	 * @param { VoiceState } oldState
	 * @param { VoiceState } newState
	 */
	exe(bot, oldState, newState) {
		const createChannelID = ['1103131450842284104', '1107340744479477931']

		/**
		 *
		 * @param { VoiceState } oldState
		 * @param { VoiceState } newState
		 * @param { Map<string, string> } map
		 * @returns
		 */
		function handleVoiceStateUpdate(oldState, newState, map) {
			const oldChannelId = oldState?.channelId
			const newChannelId = newState?.channelId

			if (!oldChannelId && createChannelID.includes(newChannelId)) {
				if (newState.channelId == '1107340744479477931') {
					voiceChannelCreate(newState, '🎶')
				} else {
					voiceChannelCreate(newState, '🔊')
				}
			} else if (oldChannelId && !newChannelId) {
				const channelId = map.get(`tmp_${oldChannelId}`)
				if (!channelId) return

				const channel = oldState.guild.channels.cache.get(channelId)
				if (!channel) return

				if (channel.members.size === 0) {
					channel.delete()
					map.delete(`tmp_${oldChannelId}`)
				}
			} else if (oldChannelId && newChannelId) {
				if (
					!createChannelID.includes(oldChannelId) &&
					createChannelID.includes(newChannelId)
				) {
					if (newState.channelId == '1107340744479477931') {
						voiceChannelCreate(newState, '🎶')
					} else {
						voiceChannelCreate(newState, '🔊')
					}
				}

				const channelId = map.get(`tmp_${oldChannelId}`)
				if (!channelId) return

				const channel = oldState.guild.channels.cache.get(channelId)
				if (!channel) return

				if (channel.members.size === 0) {
					channel.delete()
					map.delete(`tmp_${oldChannelId}`)
				}
			}
		}

		/**
		 *
		 * @param { VoiceState } newState
		 */
		async function voiceChannelCreate(newState, emoji) {
			const newVoiceChannel = await newState.guild.channels.create({
				name: `${emoji}・Canal de ${newState.member.user.username}`,
				type: 2,
				parent: newState.channel?.parent,
				permissionOverwrites: [
					{
						id: newState.member.user.id,
						allow: ['ManageChannels'],
					},
				],
			})

			await newState.member.voice.setChannel(newVoiceChannel.id)

			map.set(`tmp_${newState.channelId}`, newVoiceChannel.id)
		}

		handleVoiceStateUpdate(oldState, newState, map)
	},
}
