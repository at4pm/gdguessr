const { join } = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { connect } = require('mongoose');
const loadCommands = require('./loaders/commands');
const loadEvents = require('./loaders/events');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
] });

client.commands = new Collection();
loadCommands(client, join(__dirname, 'commands'));
loadEvents(client, join(__dirname, 'events'));

(async () => {
	await connect(process.env.DBURI);
	await client.login(process.env.TOKEN);
})()
