import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import {} from '@discordjs/voice';
import { connectVC } from '../functions/connectVC';

const data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('connect')
    .setDescription('Connects the bot to a voice channel.');

export default {
    data: data,
    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        const member = await guild.members.fetch(interaction.member.id);
        const channel: VoiceChannel = member?.voice.channel as VoiceChannel;

        console.debug(`User ${member.user.tag} is trying to connect the bot to channel: ${channel?.name}`);
        if (!channel || !channel.joinable || !channel.speakable) {
            await interaction.reply({
                content:
                    'ボイスチャンネルに参加していません。\nボイスチャンネルに参加してからコマンドを実行してください。\nすでに参加している場合は、botがそのチャンネルに参加する権限があることを確認してください。',
            });
            return;
        }

        // Here you would add the logic to connect the bot to the specified voice channel.
        // This typically involves using the @discordjs/voice library to create a connection.

        try {
            await connectVC(channel);
            await interaction.reply({ content: `${channel.name} に参加しました。` });
        } catch (error) {
            console.error('Error connecting to voice channel:', error);
            await interaction.reply({ content: 'ボイスチャンネルに参加できませんでした。' });
        }
    },
};
