const {
	SlashCommandBuilder,
	EmbedBuilder,
	userMention,
} = require("discord.js");
const { difficulties } = require("../../../config.json");
const { UserModel } = require("../../schema/user.js");
const { randomCreator } = require("../../util/random.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("creatorguess")
		.setDescription("Guess a randomly chosen creator!")
		.addStringOption(option =>
			option
				.setName("difficulty")
				.setDescription("Choose a difficulty!")
				.setRequired(true)
				.addChoices(
					{ name: "Easy", value: "Easy" },
					{ name: "Medium", value: "Medium" },
					{ name: "Hard", value: "Hard" },
					{ name: "Insane", value: "Insane" },
				),
		),

	async execute(interaction) {
		const difficulty = interaction.options.getString("difficulty");
		const difficultyConfig = difficulties[difficulty];
		const creator = randomCreator(difficulty);

		const guessEmbed = new EmbedBuilder()
			.setColor(0xffff00)
			.setTitle("Guess the Creator!")
			.setDescription(
				`**Difficulty:** ${difficultyConfig.emoji} ${difficulty}`,
			)
			.setImage(creator.file);
		await interaction.reply({ embeds: [guessEmbed] });

		const filter = message =>
			message.content.toLowerCase() === creator.name.toLowerCase();
		const collector = interaction.channel.createMessageCollector({
			filter,
			time: 30_000,
		});

		collector.on("collect", async message => {
			collector.stop("guessed");

			const points = difficultyConfig.points;
			const user = await UserModel.findByIdAndUpdate(
				message.author.id,
				{
					_id: message.author.id,
					$inc: { points },
				},
				{ new: true, upsert: true },
			);

			const correctEmbed = new EmbedBuilder()
				.setColor(0x00ff00)
				.setTitle(`Correct!`)
				.setDescription(`You have gained **${points}** points.`)
				.setFooter({ text: `New balance: ${user.points} points` });
			await message.reply({ embeds: [correctEmbed] });
		});

		collector.on("end", async (_collected, reason) => {
			if (reason === "guessed") return;
			await interaction.followUp("Times up!");
		});
	},
};
