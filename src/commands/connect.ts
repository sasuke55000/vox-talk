import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import {} from '@discordjs/voice';

const data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('connect')
    .setDescription('Connects the bot to a voice channel.');

export default {
    data: data,
    async execute(interaction: ChatInputCommandInteraction) {
        const member: GuildMember = interaction.member as GuildMember;
        const channel: VoiceChannel = member?.voice.channel as VoiceChannel;

        console.log(`User ${member.user.tag} is trying to connect the bot to channel: ${channel?.name}`);
        if (!channel || !channel.joinable || !channel.speakable) {
            await interaction.reply({
                content:
                    'ボイスチャンネルに参加していません。\nボイスチャンネルに参加してからコマンドを実行してください。\nすでに参加している場合は、botがそのチャンネルに参加する権限があることを確認してください。',
            });
            return;
        }

        // Here you would add the logic to connect the bot to the specified voice channel.
        // This typically involves using the @discordjs/voice library to create a connection.

        await interaction.reply({ content: `${channel.name} に参加しました。` });
    },
};
