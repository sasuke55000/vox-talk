export interface VoicevoxCallerConfig {
    speaker: number;
    speedScale: number;
    pitchScale: number;
    intonationScale: number;
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

export class VoicevoxApiCaller {
    private readonly baseUrl: string;

    constructor(baseUrl = process.env.VOICEVOX_URL ?? 'http://127.0.0.1:50021') {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    async synthesize(text: string, speaker: number = 1, settings: VoicevoxCallerConfig): Promise<Buffer> {
        if (settings.speedScale <= 0) {
            throw new Error('speedScale must be greater than 0');
        }
        const queryParams = new URLSearchParams({
            text,
            speaker: String(speaker),
        });

        const queryResponse = await fetch(`${this.baseUrl}/audio_query?${queryParams}`, { method: 'POST' });

        if (!queryResponse.ok) {
            throw new Error(`VOICEVOX audio_query failed: ${queryResponse.status} ${await queryResponse.text()}`);
        }

        const audioQuery: unknown = await queryResponse.json();
        // audioQuery.speedScale = settings.speedScale;
        // audioQuery.pitchScale = settings.pitchScale;
        // audioQuery.intonationScale = settings.intonationScale;
        console.debug('VOICEVOX audio_query response:', audioQuery);

        const synthesisResponse = await fetch(`${this.baseUrl}/synthesis?speaker=${speaker}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(audioQuery),
        });

        if (!synthesisResponse.ok) {
            throw new Error(`VOICEVOX synthesis failed: ${synthesisResponse.status} ${await synthesisResponse.text()}`);
        }

        return Buffer.from(await synthesisResponse.arrayBuffer());
    }
}
