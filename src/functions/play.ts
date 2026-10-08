import { AudioPlayerStatus, createAudioResource, entersState, StreamType } from '@discordjs/voice';
import { vcPlayer, vcPlaying, vcQueue } from './config.js';
import { VoicevoxApiCaller } from './ttsCaller/voicevox.js';
import { Readable } from 'stream';

export async function play(guildId: string): Promise<void> {
    vcPlaying.set(guildId, true);
    while (true) {
        const cueue = vcQueue.get(guildId);
        if (!cueue || cueue.length === 0) {
            console.log(`No items in the queue for guild: ${guildId}`);
            vcPlaying.set(guildId, false);
            return;
        }
        const currentItem = cueue.shift();
        if (!currentItem) {
            console.log(`No items in the queue for guild: ${guildId}`);
            vcPlaying.set(guildId, false);
            return;
        }

        const { text, connection } = currentItem;
        console.log(`Playing text for guild: ${guildId}, text: ${text}`);

        try {
            const voicevoxCaller = new VoicevoxApiCaller();
            const audioBuffer = await voicevoxCaller.synthesize(text, 1, {
                speaker: 47,
                speedScale: 2.0,
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

            console.log(`Playing audio for guild: ${connection.joinConfig.guildId}`);
            // TODO: 絵文字読み上げ、長音/同音連続
            await entersState(player, AudioPlayerStatus.Idle, 5 * 60_000);
            player.play(resource);
            await entersState(player, AudioPlayerStatus.Playing, 100);
            console.log(`Finished playing audio for guild: ${connection.joinConfig.guildId}`);
        } catch (error) {
            console.error(`Error while processing queue item in guild: ${guildId}`, error);
            continue; // Skip to the next item in the queue
        }
    }
}
