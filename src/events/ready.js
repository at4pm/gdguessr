const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute() {
		console.log("GDGUESSR | Bot ready");
	},
};
