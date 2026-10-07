import { AudioPlayer } from '@discordjs/voice';

// key: guildId, value: channelId
export const vcChannelId = new Map<string, string>();

// key: guildId, value: AudioPlayer
export const vcPlayer = new Map<string, AudioPlayer>();

export interface QueueItem {
    text: string;
    connection: VoiceConnection;
}

// key: guildId, value: QueueItem[]
export const vcQueue = new Map<string, QueueItem[]>();
export const vcPlaying = new Map<string, boolean>();
