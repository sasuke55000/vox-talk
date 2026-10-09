import { type TTSSettings, TTSProvider } from '../config.js';

export interface VoicevoxCallerConfig extends TTSSettings {
    speaker: string;
    speed: number;
    pitch: number;
    intonation: number;
}

interface VoicevoxAudioQuery {
    accentPhrases: unknown[];
    speedScale: number;
    pitchScale: number;
    intonationScale: number;
    volumeScale: number;
    prePhonemeLength: number;
    postPhonemeLength: number;
    outputSamplingRate: number;
    outputStereo: boolean;
    kana: string;
}

class VoicevoxApiCaller extends TTSProvider<VoicevoxCallerConfig> {
    provider = 'voicevox';
    baseUrl: string;

    constructor(baseUrl = process.env.VOICEVOX_URL ?? 'http://127.0.0.1:50021') {
        super();
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    async synthesize(text: string, settings: VoicevoxCallerConfig): Promise<Buffer> {
        if (settings.speed <= 0) {
            throw new Error('speed must be greater than 0');
        }
        if (text.length > 200) {
            text = text.substring(0, 200);
        }
        const queryParams = new URLSearchParams({
            text,
            speaker: settings.speaker,
        });

        try {
            const queryResponse = await fetch(`${this.baseUrl}/audio_query?${queryParams}`, { method: 'POST' });

            if (!queryResponse.ok) {
                throw new Error(`VOICEVOX audio_query failed: ${queryResponse.status} ${await queryResponse.text()}`);
            }

            const audioQuery: VoicevoxAudioQuery = await queryResponse.json();
            audioQuery.speedScale = settings.speed;
            audioQuery.pitchScale = settings.pitch;
            audioQuery.intonationScale = settings.intonation;
            console.debug('VOICEVOX audio_query response:', audioQuery);

            const synthesisResponse = await fetch(`${this.baseUrl}/synthesis?speaker=${settings.speaker}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(audioQuery),
            });

            if (!synthesisResponse.ok) {
                throw new Error(
                    `VOICEVOX synthesis failed: ${synthesisResponse.status} ${await synthesisResponse.text()}`,
                );
            }
            return Buffer.from(await synthesisResponse.arrayBuffer());
        } catch (error) {
            console.error('Error during VOICEVOX API call:', error);
            throw error;
        }
    }
}

export default new VoicevoxApiCaller();
