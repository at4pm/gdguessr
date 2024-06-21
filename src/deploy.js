const { join } = require('node:path');
const { REST, Routes } = require('discord.js');
const loadCommands = require('./loaders/commands');

const commands = loadCommands(null, join(__dirname, 'commands'));
const rest = new REST().setToken(process.env.TOKEN);

async function deploy() {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const application = await rest.get(Routes.oauth2CurrentApplication());
		const data = await rest.put(
			Routes.applicationCommands(application.id),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

deploy();
