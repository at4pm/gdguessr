const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getClient } = require('../../util/db.js');

const dbClient = getClient();

module.exports = {
    data: new SlashCommandBuilder()
       .setName('leaderboard')
       .setDescription('View the points leaderboard!'),
    
    async execute(interaction) {
        const leaderboard = dbClient.db("points").collection('users');
        let users = await leaderboard.find().sort({ points: -1}).limit(10).toArray();
        
        const embed = new EmbedBuilder()
            .setTitle(":earth_asia: Global Leaderboard")
            .setDescription('Points Leaderboard');

        users.forEach((user, index) => {
            embed.addFields({ name: `#${index + 1} ${interaction.guild.members.cache.get(user.id).user.tag}: ${user.points.toString()}`, value: "\u200B" });
        });

        await interaction.reply({ embeds: [embed] });
    }
};