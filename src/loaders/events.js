const { readdirSync } = require('node:fs');
const { join } = require('node:path');

function isEvent(obj) {
	return 'name' in obj && 'execute' in obj;
}

function loadEvents(client, dirPath) {
	const files = readdirSync(dirPath, { withFileTypes: true }).filter(file =>
		file.isDirectory() || (file.isFile() && file.name.endsWith('.js'))
	);

	for (const file of files) {
		const filePath = join(dirPath, file.name);

		if (file.isDirectory()) {
			loadEvents(client, filePath);
			continue;
		}

		const event = require(filePath);

		if (!isEvent(event)) {
			console.warn(`The event at ${filePath} is missing a required "name" or "execute" property.`);
			continue;
		}

		client[event.once ? 'once' : 'on'](event.name, event.execute);
	}
}

module.exports = loadEvents;
