import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnection,
} from '@discordjs/voice';
import {} from 'discord.js';
import path from 'path';
import { vcPlayer } from './config.js';

export async function play(connection: VoiceConnection, text: string): Promise<void> {
    const resource = createAudioResource(path.join(import.meta.dirname, 'audio.wav'), {
        inputType: StreamType.Arbitrary,
    });

    const player = vcPlayer.get(connection.joinConfig.guildId);
    if (!player) {
        throw new Error(`No audio player found for guild: ${connection.joinConfig.guildId}`);
    }

    try {
        player.play(resource);
        await entersState(player, AudioPlayerStatus.Playing, 100);
        await entersState(player, AudioPlayerStatus.Idle, 5 * 60_000);
    } catch (error) {
        console.error(`Error while trying to play audio in guild: ${connection.joinConfig.guildId}`, error);
        throw error;
    }
}
