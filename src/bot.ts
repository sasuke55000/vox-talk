import { Client, GatewayIntentBits } from 'discord.js';
import { initDB } from './functions/database.js';
import { registerCommands } from './handlers/commandHandler.js';
import { registerEvents } from './handlers/eventHandler.js';
import { initTTSCaller } from './functions/initTTSCaller.js';

// init Database
initDB();

// init TTS Caller
initTTSCaller();

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Load commands
await registerCommands(client);
// Load events
await registerEvents(client);

// login to Discord with your app's token
client.login(process.env.DISCORD_BOT_TOKEN);
