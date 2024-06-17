const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');
const { getClient, connectDB } = require('../../util/db.js');
const { difficulties } = require('../../../config.json');
const random = require("../../util/random.js");

const dbClient = getClient();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('creatorguess')
		.setDescription('Guess a randomly chosen creator!')
		.addStringOption(option =>
			option.setName('difficulty')
				.setDescription('Choose a difficulty!')
				.setRequired(true)
				.addChoices(
					{ name: 'Easy', value: 'Easy' },
					{ name: 'Medium', value: 'Medium' },
					{ name: 'Hard', value: 'Hard' },
				)),
	
	async execute(interaction) {
		var diff = interaction.options.getString('difficulty');
		var randomC = random('creator');

		while (randomC.difficulty != diff) {
			randomC = random('creator');
		}

		const guessEmbed = new EmbedBuilder()
			.setColor(0xFFFF00)
			.setDescription(`**Guess the Creator!**\nDifficulty: ${difficulties[randomC.difficulty]["emoji"]} ${randomC.difficulty}`)
			.setImage(`https://mewo.lol/bot/images/creators/${randomC.file}`);

		await interaction.reply({ embeds: [guessEmbed] });

		const filter = message => message.content.toLowerCase() === randomC.name.toLowerCase();
		const collector = interaction.channel.createMessageCollector({ filter, time: 30_000 });

		collector.on('collect', async message => {
			collector.stop('guessed');
			var points = difficulties[diff]['points'];

			try {
				await connectDB();
				const collection = dbClient.db("points").collection('users');
				let user = await collection.findOne({ id: interaction.user.id });
				if (!user) {
					var newbal = points;
					await collection.insertOne({
						id: interaction.user.id,
						points: points
					});
				} else {
					var newbal = user.points + points;
					await collection.updateOne(
						{ id: interaction.user.id },
						{ $set: { points: newbal } }
					);
				}
			} finally {
				await dbClient.close();
			}

			const correctEmbed = new EmbedBuilder()
				.setColor(0x00FF00)
				.setTitle("**Correct!**")
				.setDescription(`**${message.author}** correctly guessed **${randomC.name}**\nThey have gained **${points}** points!\nNew balance: **${newbal}**`);
			await interaction.followUp({ embeds: [correctEmbed] });
			
		});

		collector.on('end', async (_collected, reason) => {
			if (reason === 'guessed') return;
			await interaction.followUp('Times up!');
		});
	}
}