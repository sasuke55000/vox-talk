import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import {} from '@discordjs/voice';

const data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnects the bot from a voice channel.');

export default {
    data: data,
    async execute(interaction: ChatInputCommandInteraction) {
        // Here you would add the logic to disconnect the bot from the voice channel.
        // This typically involves using the @discordjs/voice library to destroy the connection.

        await interaction.reply({ content: 'ボイスチャンネルから切断しました。' });
    },
};
