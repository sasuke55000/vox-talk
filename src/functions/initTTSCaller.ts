import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { TTSProvider, type TTSSettings } from './config.js';
import { TTSProviders } from './config.js';

export async function initTTSCaller() {
    const directory = path.join(import.meta.dirname, './ttsCaller');
    const files = await readdir(directory).then((files) => files.filter((file) => file.endsWith('.ts')));

    for (const file of files) {
        const filePath = path.join(directory, file);

        const ttsModule: TTSProvider<TTSSettings> = (await import(pathToFileURL(filePath).href)).default;

        if (!isTTSProvider(ttsModule)) {
            throw new Error(`Invalid TTS provider module: ${file}`);
        }
        if (TTSProviders.has(ttsModule.provider)) {
            throw new Error(`Duplicate TTS provider id: ${ttsModule.provider}`);
        }

        TTSProviders.set(ttsModule.provider, ttsModule);
    }
}

function isTTSProvider(module: unknown): module is TTSProvider<TTSSettings> {
    if (!module || typeof module !== 'object') {
        return false;
    }

    if (module instanceof TTSProvider) {
        return true;
    } else {
        return false;
    }
}
