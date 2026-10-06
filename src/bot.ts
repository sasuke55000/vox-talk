import { Client, Events, GatewayIntentBits } from 'discord.js';
import { initCommands } from './initCommands';
import { registerCommands } from './handlers/commandHandler';
import { registerEvents } from './handlers/eventHandler';

const client: Client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

//await initCommands();
// Load commands
await registerCommands(client);
// Load events
await registerEvents(client);

client.login(process.env.DISCORD_BOT_TOKEN);

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    readyClient.user.setActivity({
        name: 'Vox Talk',
        type: 0, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
    });
});
