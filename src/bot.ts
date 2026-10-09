import { Client, GatewayIntentBits } from 'discord.js';
import { initCommands } from './initCommands';
import { initDB } from './functions/database.js';
import { registerCommands } from './handlers/commandHandler';
import { registerEvents } from './handlers/eventHandler';
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

//await initCommands();
// Load commands
await registerCommands(client);
// Load events
await registerEvents(client);

// login to Discord with your app's token
client.login(process.env.DISCORD_BOT_TOKEN);
