const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("responde com 'Pong!'"),

    async execute(interaction) {
        await interaction.reply("Pong!");
    }
}