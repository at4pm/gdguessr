const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const random = require("../../util/random.js");

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
					{ name: 'Hard', value: 'Hard' },
				)),
	
	async execute(interaction) {
		var diff = interaction.options.getString('difficulty');
		var randomC = random('creator');

		do {
			randomC = random('creator');
		} while (randomC['difficulty'] != diff);

		const embed = new EmbedBuilder()
			.setColor(0xFFFF00)
			.setDescription(`**Guess the Creator!**\nDifficulty: ${randomC['difficulty']}`)
			.setImage(`https://mewo.lol/bot/images/creators/${randomC['file']}`);

		const response = await interaction.reply({ embeds: [embed] })
			.then(() => {
				interaction.channel.awaitMessages({ time: 30_000, errors: ['time']})
					.then(collected => {
						if (collected.first().content.toLowerCase() === randomC['name'].toLowerCase()) {
							interaction.reply(`${collected.first().author} got it right!`);
							return;
						}
					})
					.catch(collected => {
						interaction.followUp("Times up!");
					});
			});
	}
}
