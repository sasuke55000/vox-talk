// Require the necessary discord.js classes
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client, Collection } from 'discord.js';

export async function registerCommands(client: Client) {
    client.commands = new Collection();
    client.cooldowns = new Collection();
    const foldersPath = path.join(import.meta.dirname, '../commands');

    const commandFiles = fs.readdirSync(foldersPath).filter((file: string) => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const commandModule = await import(pathToFileURL(filePath).href);
        const command = commandModule.default ?? commandModule;
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`Registered command: ${command.data.name}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
