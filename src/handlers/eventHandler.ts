// Require the necessary discord.js classes
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from 'discord.js';

export async function registerEvents(client: Client) {
    const eventsPath = path.join(import.meta.dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const eventModule = await import(pathToFileURL(filePath).href);
        const event = eventModule.default ?? eventModule;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}
