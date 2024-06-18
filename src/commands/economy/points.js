const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../schema/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your point balance!'),

    async execute(interaction) {
        const user = await UserModel.findByIdAndUpdate(interaction.user.id, {
            _id: interaction.user.id,
        }, { new: true, upsert: true });
        
        const balanceEmbed = new EmbedBuilder()
            .setTitle('Balance')
            .setColor(0xFFFF00)
            .setDescription(`You have **${user.points}** points!`);
        
        await interaction.reply({ embeds: [balanceEmbed] });
    }
}
