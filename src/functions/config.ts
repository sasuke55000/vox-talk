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
// key: guildId, value: whether the bot is currently playing audio in the VC
export const vcPlaying = new Map<string, boolean>();

export interface Speakers {
    [key: string]: string;
    name: string;
    provider: string;
    speakerId: string;
}

export interface TTSSettings {
    speaker: string;
    speed: number;
    pitch: number;
}

export abstract class TTSProvider<T extends TTSSettings> {
    abstract provider: string;
    abstract baseUrl: string;
    abstract synthesize(text: string, settings: T): Promise<Buffer>;
}
export const TTSProviders = new Map<string, TTSProvider<TTSSettings>>();
