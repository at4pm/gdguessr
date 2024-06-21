const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../schema/user.js');

const idToName = async (id) => {
	const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
		headers: {
			Authorization: `Bot ${process.env.TOKEN}`
		},
		method: 'GET',
	});
	if (!response.ok) return new Error(`API shit: ${response.status}`);
	return await response.text();
}

module.exports = {
	data: new SlashCommandBuilder()
	   .setName('leaderboard')
	   .setDescription('View the points leaderboard!'),
	
	async execute(interaction) {
		let users = await UserModel.find().sort({ points: -1}).limit(10);
	
		const embed = new EmbedBuilder()
			.setTitle(":earth_asia: Global Leaderboard")
			.setDescription('Points Leaderboard');

		await Promise.all(
			users.map(async (user, index) => {
				const data = await idToName(user.id);
				const username = await JSON.parse(data).username;
				embed.addFields({ name: `#${index + 1} ${username}: ${user.points.toString()}`, value: " " });
			}),
		);

		await interaction.reply({ embeds: [embed] });
	}
};