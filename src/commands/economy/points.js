const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MongoClient, ServerApiVersion } = require('mongodb');

const dbClient = new MongoClient(process.env.DBURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your point balance!'),

    async execute(interaction) {
        let points = 0;
        try {
            await dbClient.connect();
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