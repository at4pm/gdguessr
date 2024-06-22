const { readdirSync } = require("node:fs");
const { join } = require("node:path");

function isCommand(obj) {
	return "data" in obj && "execute" in obj;
}

function loadCommands(client, dirPath) {
	const data = [];

	const files = readdirSync(dirPath, { withFileTypes: true }).filter(
		file =>
			file.isDirectory() || (file.isFile() && file.name.endsWith(".js")),
	);

	for (const file of files) {
		const filePath = join(dirPath, file.name);

		if (file.isDirectory()) {
			data.push(...loadCommands(client, filePath));
			continue;
		}

		const command = require(filePath);

		if (!isCommand(command)) {
			console.warn(
				`The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
			continue;
		}

		client?.commands.set(command.data.name, command);
		data.push(command.data.toJSON());
	}

	return data;
}

module.exports = loadCommands;
