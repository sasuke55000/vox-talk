import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const token: string = process.env.DISCORD_TOKEN as string;
const clientId: string = process.env.CLIENT_ID as string;

export async function initCommands() {
    const rest = new REST().setToken(token);
    const commands = [];
    const foldersPath = path.join(import.meta.dirname, 'commands');

    const commandFiles = fs.readdirSync(foldersPath).filter((file: string) => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const commandModule = await import(pathToFileURL(filePath).href);
        const command = commandModule.default ?? commandModule;
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        await rest
            .put(Routes.applicationCommands(clientId), { body: commands })
            .then(() => console.log(`Successfully reloaded ${commands.length} application (/) commands.`));
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
        throw error;
    }
}
