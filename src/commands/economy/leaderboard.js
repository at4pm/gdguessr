const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getClient, connectDB } = require('../../util/db.js');

const dbClient = getClient();

module.exports = {
    data: new SlashCommandBuilder()
       .setName('leaderboard')
       .setDescription('View the points leaderboard!'),
    
    async execute(interaction) {
        try {
            await connectDB();
            var leaderboard = dbClient.db("points").collection('users');

            let users = await leaderboard.find().sort({ points: -1}).limit(10).toArray();
        
            const embed = new EmbedBuilder()
                .setTitle(":earth_asia: Global Leaderboard")
                .setDescription('Points Leaderboard');

            users.forEach((user, index) => {
                embed.addFields({ name: `#${index + 1}: ${user.points.toString()}`, value: " " });
            });

            await interaction.reply({ embeds: [embed] });
        } finally {
            await dbClient.close();
        }
    }
};