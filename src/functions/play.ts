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
import { VoicevoxApiCaller } from './ttsCaller/voicevox.js';
import { Readable } from 'stream';

export async function play(connection: VoiceConnection, text: string): Promise<void> {
    const voicevoxCaller = new VoicevoxApiCaller();
    const audioBuffer = await voicevoxCaller.synthesize(text, 1, {
        speaker: 1,
        speedScale: 1.0,
        pitchScale: 1.0,
        intonationScale: 1.0,
    });
    const resource = createAudioResource(Readable.from([audioBuffer]), {
        inputType: StreamType.Arbitrary,
    });

    const player = vcPlayer.get(connection.joinConfig.guildId);
    if (!player) {
        throw new Error(`No audio player found for guild: ${connection.joinConfig.guildId}`);
    }

    //TODO:キュー、絵文字読み上げ、長音/同音連続

    try {
        player.play(resource);
        await entersState(player, AudioPlayerStatus.Playing, 100);
        await entersState(player, AudioPlayerStatus.Idle, 5 * 60_000);
    } catch (error) {
        console.error(`Error while trying to play audio in guild: ${connection.joinConfig.guildId}`, error);
        throw error;
    }
}
