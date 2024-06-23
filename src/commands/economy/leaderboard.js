const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { UserModel } = require("../../schema/user.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("View the points leaderboard!"),

	async execute(interaction) {
		const users = await UserModel.find().sort({ points: -1 }).limit(10);

		const embed = new EmbedBuilder()
			.setTitle(
				":earth_asia: <:Trophy:1253919091656495144>  Global Leaderboard",
			)
			.setDescription("Points Leaderboard");

		for await (const [index, user] of users.entries()) {
			const username = await user.getUsername(interaction.client);

			embed.addFields({
				name: `#${index + 1} ${username}: ${user.points.toString()}`,
				value: " ",
			});
		}

		await interaction.reply({ embeds: [embed] });
	},
};
