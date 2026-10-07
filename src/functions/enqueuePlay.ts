import { createAudioResource, StreamType, type VoiceConnection } from '@discordjs/voice';
import {} from 'discord.js';
import { VoicevoxApiCaller } from './ttsCaller/voicevox.js';
import { Readable } from 'stream';
import { vcPlayer, vcPlaying, vcQueue, type QueueItem } from './config.js';
import { play } from './play.js';

export async function enqueuePlay(connection: VoiceConnection, text: string): Promise<void> {
    const queue: QueueItem[] = vcQueue.get(connection.joinConfig.guildId) ?? [];

    queue.push({ text, connection });
    vcQueue.set(connection.joinConfig.guildId, queue);

    if (vcPlaying.get(connection.joinConfig.guildId) !== true) {
        // Start playing the first item in the queue
        await play(connection.joinConfig.guildId);
    }
}
