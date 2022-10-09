const fs = require('fs');
const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [
		Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
const token = "";
const clientId = "";
const guildId = "";
const channelID = "";
let lastUser = null;
var eventFolders = fs.readdirSync('./events', { withFileTypes: true })
    .filter(file => file.isDirectory())
    .map(file => file.name)
for (let folder of eventFolders) {
	fs.readdirSync(`./events/${folder}`)
	.filter(file => file.endsWith(".js")).forEach(file => {
		const event = require(`./events/${folder}/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	});
}
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		rest.get(
			Routes.applicationCommands(clientId),
		).then(data => {
			const promises = [];
			for (const command of data) {
				const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
				promises.push(rest.delete(deleteUrl));
			}
			return Promise.all(promises);
		});
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: (client.commands.map(x => x.config)) },
		);
	} catch (error) {
		console.error(error);
	}
})();

module.exports = {
	setLastUserStory: (userId) => {
		lastUser = userId;
	},
	getLastUserStory: () => {
		return lastUser;
	},
	getChannelID: () => {
		return lastUser;
	}
};

client.login(token);