const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getClient, connectDB } = require('../../util/db.js');

const dbClient = getClient();

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
        try {
            await connectDB();
            var leaderboard = dbClient.db("points").collection('users');

            let users = await leaderboard.find().sort({ points: -1}).limit(10).toArray();
        
            const embed = new EmbedBuilder()
                .setTitle(":earth_asia: Global Leaderboard")
                .setDescription('Points Leaderboard');

            users.forEach(async (user, index) => {
                const data = await idToName(user.id);
                const username = await JSON.parse(data).username;
                console.log(username);
                embed.addFields({ name: `#${index + 1} ${username}: ${user.points.toString()}`, value: " " });
            });

            await interaction.reply({ embeds: [embed] });
        } finally {
            await dbClient.close();
        }
    }
};