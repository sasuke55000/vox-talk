import { AudioPlayer } from '@discordjs/voice';

// key: guildId, value: channelId
export const vcChannelId = new Map<string, string>();

// key: guildId, value: AudioPlayer
export const vcPlayer = new Map<string, AudioPlayer>();
