import {
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    NoSubscriberBehavior,
} from '@discordjs/voice';
import { type VoiceBasedChannel, ChannelType } from 'discord.js';
import { vcPlayer } from './config';

export async function connectVC(channel: VoiceBasedChannel): Promise<VoiceConnection> {
    if (!channel || channel.type !== ChannelType.GuildVoice) {
        throw new Error('The provided channel is not a valid voice channel.');
    }

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
    });

    try {
        console.debug(`Attempting to connect to voice channel: ${channel.name}`);
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        connection.subscribe(player);
        vcPlayer.set(connection.joinConfig.guildId, player);

        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}
