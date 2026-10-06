import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { disconnectVC } from '../functions/disconnectVC';

const data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnects the bot from a voice channel.');

export default {
    data: data,
    async execute(interaction: ChatInputCommandInteraction) {
        const connection = getVoiceConnection(interaction.guild?.id || '');
        if (!connection) {
            await interaction.reply({ content: 'ボイスチャンネルに接続していません。' });
            return;
        }
        await disconnectVC(connection);

        await interaction.reply({ content: 'ボイスチャンネルから切断しました。' });
    },
};
