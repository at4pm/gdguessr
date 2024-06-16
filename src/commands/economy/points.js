const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getClient, connectDB } = require('../../util/db.js');

const dbClient = getClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your point balance!'),

    async execute(interaction) {
        let points = 0;
        try {
            await connectDB();
            const collection = dbClient.db("points").collection('users');
            let user = await collection.findOne({ id: interaction.user.id });
            if (!user) {
                await collection.insertOne({
                    id: interaction.user.id,
                    points: 0
                });
                points = 0;
            } else {
                points = user.points;
            }
        } finally {
            await dbClient.close();
        }
        
        const balanceEmbed = new EmbedBuilder()
            .setTitle('Balance')
            .setColor(0xFFFF00)
            .setDescription(`You have **${points}** points!`);
        
        await interaction.reply({ embeds: [balanceEmbed] });
    }
}